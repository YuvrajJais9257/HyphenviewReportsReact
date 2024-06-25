import psycopg2

try:
    conn = psycopg2.connect(
        host = 'localhost',
        user = 'postgres',
        password = 'Admin123*',
        port = 5432,
        database = 'smaxdata'
    )
    conn.close()
    print(True)
except psycopg2.Error as e:
    print(e)
