import smtplib
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


class SendEmailOffice365:
    def __init__(self, email, password,smtp,port):
        self.email = email
        self.password = password
        self.smtp = smtp
        self.port = port
    def send_email_with_attachments(self, recipient_email,cc_emails, subject, body, attachment_paths):
        msg = MIMEMultipart()
        msg['From'] = self.email
        msg['To'] = ', '.join(recipient_email)
        msg['Cc'] = ', '.join(cc_emails) if cc_emails else ''
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))

     
        for attachment_path in attachment_paths:
            print(attachment_path)
            try:
                with open(attachment_path, 'rb') as attachment:
                    part = MIMEBase('application', 'octet-stream')
                    part.set_payload(attachment.read())
            except Exception as err:
                continue

            # Encode file in ASCII characters to send by email
            encoders.encode_base64(part)

            # Add header as key/value pair to attachment part
            filename = attachment_path.split("/")[1]
            print(filename)
            part.add_header(
                "Content-Disposition",
                f"attachment; filename= {filename}"
            )

            msg.attach(part)

        text = msg.as_string()

        try:
            server = smtplib.SMTP(self.smtp, self.port)
            server.starttls()
            server.login(self.email, self.password)
            to_cc_mail = recipient_email + cc_emails
            server.sendmail(self.email, to_cc_mail, text)
            print("Email sent successfully!")
        except Exception as e:
            print("Failed to send email:", e)
        finally:
            if "server" in locals():
                server.quit()
