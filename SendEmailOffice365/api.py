from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
import pandas as pd
import os
import psycopg2
import mysql.connector
from urllib.parse import unquote
import fitz
from PyPDF2 import PdfReader
from io import BytesIO
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import portrait,A4
from datetime import datetime

app = FastAPI()

def extract_text_and_images(pdf_path):
    images = []

    results = []
    pdf = fitz.open(pdf_path)
    
    first_page = pdf[0]
    dict = first_page.get_text("dict")
    blocks = dict["blocks"]
    
    for block in blocks:
        if "lines" in block.keys():
            spans = block['lines']
            for span in spans:
                data = span['spans']
                for lines in data:
                    if lines['size']>=10:
                        results.append((lines['text'], lines['size'], lines['font']))
    
    pdf.close()

    pdf_reader = PdfReader(pdf_path)

    for page_num in range(0,1):#(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        xObject = page['/Resources']['/XObject'].get_object()

        for obj in xObject:
            if xObject[obj]['/Subtype'] == '/Image':
                img = xObject[obj]
                img_data = img._data

                pil_img = Image.open(BytesIO(img_data))
                images.append(pil_img)

    return results, images

def create_new_pdf(output_path, pdf_text, pdf_images, result, column_names):
    try:
        print(pdf_text)
        c = canvas.Canvas(output_path,pagesize=portrait(A4))
        y_text = 770

        for text, size, font in pdf_text:
            c.setFont(font, size)
            c.drawString(50, y_text, text)
            y_text -= size + 1

        x_img = 475
        y_img = 760

        for image in pdf_images:
            c.drawInlineImage(image, x_img, y_img, width=60, height=30)
            # y_img -= 120

        y_column = 700
        x_column = 50
        for col in column_names:
            c.setFont(font,9)
            c.drawString(x_column,y_column,col)
            x_column += 70

        y_result = 670
        for res in result:
            x_result = 50
            for val in res.values():
                c.setFont(font, 9)
                c.drawString(x_result, y_result, str(val))
                x_result += 70
            y_result -= 10 + 1
        c.save()

        # excel_file_path = os.path.join(output_path, "result.xlsx")
        return "created pdf"

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing result to Excel: {e}")

def connect_and_execute_mysql(host, port, database, user, password, query):
    try:
        connection = mysql.connector.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )

        cursor = connection.cursor(dictionary=True)
        cursor.execute(query)
        result = cursor.fetchall()
        column_names = [column[0] for column in cursor.description]
        cursor.close()
        connection.close()

        return result,column_names

    except Exception as e:
        print(f"Error: {e}")
        return None

def connect_and_execute_postgresql(host, port, database, user, password, query):
    try:
        connection = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )

        cursor = connection.cursor()

        cursor.execute(query)

        result = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        cursor.close()
        connection.close()

        return result,column_names

    except Exception as e:
        print(f"Error: {e}")
        return None

def execute_query_and_save_to_excel(result, column_names, custom_directory):
    try:
        df = pd.DataFrame(result, columns=column_names)

        if not os.path.exists(custom_directory):
            os.makedirs(custom_directory)

        excel_file_path = os.path.join(custom_directory, "result.xlsx")
        df.to_excel(excel_file_path, index=False)

        return excel_file_path

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing result to Excel: {e}")

def db_data_fetcher(db_type,query):
    # For mysql
    host = "localhost"
    port = 3306
    database = "ai_db"
    user = "root"
    password = "root"

    # For postgres
    # host = "localhost"
    # port = 5432
    # database = "nsb"
    # user = "postgres"
    # password = "root"

    if not all([db_type, host, port, database, user, password, query]):
        raise HTTPException(status_code=400, detail="Incomplete request data")

    if db_type == "mysql":
        result,column_names = connect_and_execute_mysql(host, port, database, user, password, query)
    elif db_type == "postgresql":
        result,column_names = connect_and_execute_postgresql(host, port, database, user, password, query)
    else:
        raise HTTPException(status_code=400, detail="Invalid database type")
    if result is None:
        raise HTTPException(status_code=500, detail="Error executing query")
    
    return result,column_names

@app.post("/execute_query_excel")
async def execute_query_xl(request: Request):
    try:
        data = await request.json()

        db_type = data.get("db_type")
        query = data.get("query")
        result,column_names = db_data_fetcher(db_type,query)
        custom_directory = "C:\erasmith\DB_to_excel_or_pdf"

        excel_file_path = execute_query_and_save_to_excel(result,column_names, custom_directory)

        return {"file_path": excel_file_path}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")

@app.post("/execute_query_pdf")
async def execute_query_xl(request: Request):
    try:
        time = datetime.now()
        output_pdf_path = "output.pdf"
        pdf_path = "GSWAN_DC_POP_Routers_2023_03_01_17_44_52_724.pdf"
        pdf_text, pdf_images = extract_text_and_images(pdf_path)
        data = await request.json()

        db_type = data.get("db_type")
        query = data.get("query")
        result,column_names = db_data_fetcher(db_type,query)
        # print(result,column_names)
        create_new_pdf(output_pdf_path, pdf_text, pdf_images,result,column_names)
        time2 = datetime.now()
        print(time2-time)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")




def decode_file_path(file_path: str) -> str:
    decoded_path = unquote(file_path.replace('%3A', ':'))
    return decoded_path

@app.get("/download/{file_path:path}")
async def download_file(file_path: str):
    try:
        decoded_file_path = decode_file_path(file_path)

        return FileResponse(decoded_file_path, filename="result.xlsx")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")