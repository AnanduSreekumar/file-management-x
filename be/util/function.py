import boto3, botocore
import pymysql
from pymysql import *
from werkzeug.utils import secure_filename
from boto3 import *
from os import environ

s3 = boto3.client(
    "s3",
    aws_access_key_id =    environ.get('AWS_ACCESS_KEY'),
    aws_secret_access_key=environ.get('AWS_SECRET_ACCESS_KEY')
)

ADMIN = 'one_d@admin.com'
SCHEMA = environ.get('RDS_SCHEMA')
TABLE_FILE_INFO = environ.get('RDS_FILE_INFO')
TABLE_USER_INFO = environ.get('RDS_USER_INFO')
CF_URL = environ.get('AWS_DOMAIN')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif','pdf'}

def upload_file_to_s3(file,file_desc,email):
    filename = secure_filename(file.filename)
    file_data = {}
    try:
        s3.upload_fileobj(
            file,
            environ.get("AWS_BUCKET_NAME"),
            filename
        )
    except Exception as e:
        message = "Error running query:{0} Generated error: {1}".format(filename,str(e))
        return False
    else:
        message = "Successfully uploaded {}".format(filename)
        file_data['file_name'] = filename
        file_data['file_desc'] = file_desc
        file_data['email'] = email
        if not save_file_name_to_rds(file_data):
            return False
    print(message)
    return True

def connect_mysql():
    db = pymysql.connect(host = environ.get('RDS_HOST'), 
                 user= environ.get('RDS_USERNAME'),
                 password = environ.get('RDS_PASSWORD'), 
                   database = environ.get('RDS_DATABASE'))
    return db

def set_upsert_rds(query):
    #function to insert and update to RDS
    try:
        print('Initiating set_upsert_rds function')
        db = connect_mysql()
        cursor = db.cursor()
        cursor.execute(query)
    except Exception as e:
        message = "Error running query:{0} Generated error: {1}".format(query,str(e))
        return False
    else:
        db.commit()
        db.close()
        message = "Query: {0} ran successfully!".format(query)
    print(message)
    return True

def get_info_rds(query):
    #function to get info from RDS
    try:
        db = connect_mysql()
        print('Initiating get_info_rds function')
        data = {}
        cursor = db.cursor()
        cursor.execute(query)
        data = cursor.fetchall()
        print("data {}".format(str(data)))
    except Exception as e:
        message = "Error running query:{0} Generated error: {1}".format(query,str(e))
    else:
        db.close()
        message = "Query: {0} ran successfully!".format(query)
    print(message)
    return data

def save_file_name_to_rds(data):
    #functions to save filename to rds
    file_name = data.get('file_name')
    file_description = data.get('file_desc')
    email = data.get('email')
    query = ("INSERT INTO {0}.{1} (file_name, file_desc,email,status,file_uploaded_timestamp,last_updated_timestamp)\
            VALUES ('{2}','{3}','{4}','INSERT', NOW(),NOW());"
             .format(SCHEMA,TABLE_FILE_INFO,file_name,file_description, email))
    return set_upsert_rds(query)

def get_file_names_rds(email):
    #functions to retrieve filenames
    if email  == ADMIN:
        query = ("select id,file_name,file_desc,CONCAT('https:{0}/' ,file_name, '/')  as url,email,status,file_uploaded_timestamp,last_updated_timestamp from {1}.{2} \
        ".format(CF_URL,SCHEMA,TABLE_FILE_INFO)) 
    else:
        query = ("select id,file_name,file_desc,status,CONCAT('https:{0}/' ,file_name, '/')  as url ,file_uploaded_timestamp,last_updated_timestamp from {1}.{2} \
        where email = '{3}' and status in ('INSERT','MODIFIED')".format(CF_URL,SCHEMA,TABLE_FILE_INFO,email))
    return get_info_rds(query)

def get_user_details_rds(email):
    #functions to retrieve userdetails
    if email == ADMIN:
        query = ("select CONCAT(firstname,' ',lastname) as user, 0 as total_files_uploaded, 0 as total_files_deleted ,email,last_updated_timestamp from {0}.{1}".format(SCHEMA,TABLE_USER_INFO))
        return get_info_rds(query)
    else:
        print("ACCESS DENIED!")
        return {}

def delete_file_name_rds(file_name,email):
    #set filename to delete
    print('Initiating delete_file_name_rds')
    if email == ADMIN:
        status = 'ADMIN-DELETE'
    else:
        status = 'DELETE'
    query = ("update {0}.{1} set status= '{2}', last_updated_timestamp = NOW() \
    where email = '{3}' and file_name = '{4}'".format(SCHEMA,TABLE_FILE_INFO,status,email,file_name))
    return set_upsert_rds(query)

def terminate_user_rds(email):
    #set filename to delete
    print('Initiating terminate_user_rds')
    query = ("delete from {0}.{1} where email = '{2}'".format(SCHEMA,TABLE_USER_INFO,email))
    return set_upsert_rds(query)

def set_user_account(user_data):
    #CREATE USER ACCOUNT
    firstname = user_data.get('firstname')
    lastname  = user_data.get('lastname')
    email     = user_data.get('email').lower()
    password  = user_data.get('password')
    query     = ("INSERT INTO {0}.{1} (firstname,lastname,email, password,last_updated_timestamp)\
            VALUES ('{2}','{3}','{4}','{5}', NOW());"
             .format(SCHEMA,TABLE_USER_INFO,firstname,lastname,email,password))
    return set_upsert_rds(query)

def confirm_user_access(user_data):
    #get user info
    email = user_data.get('email')    
    query = ("select password from {0}.{1} \
    where email = '{2}'".format(SCHEMA,TABLE_USER_INFO,email))
    if user_data.get('password') == get_info_rds(query)[0][0]:
        return True
    else:
        return False

def delete_file_s3(file_name,email):
    #delete files
    try:
        print("Initiating delete_file_s3!")
        s3.delete_object(
            Bucket = environ.get("AWS_BUCKET_NAME"),
            Key = file_name
        )
    except Exception as e:
        message = "Failed to delete {} file with error {}".format(file_name,str(e))
        return False
    else:
        message = 'Successfully deleted file'
        if not delete_file_name_rds(file_name,email):
            return False
    print(message)
    return True

def modify_file_rds(file_name,file_desc,email):
    #set filename to update
    print('Initiating delete_file_name_rds')
    query = ("update {0}.{1} set status='MODIFIED', file_desc = '{4}', last_updated_timestamp = NOW() \
    where email = '{2}' and file_name = '{3}'".format(SCHEMA,TABLE_FILE_INFO,email,file_name,file_desc))
    return set_upsert_rds(query)

def modify_file_s3(file,file_name,file_desc,email):
    #delete files
    try:
        #put apporach
        # s3.put_object(Body=file, 
        #               Bucket=environ.get("AWS_BUCKET_NAME"), 
        #               Key=file_name)
        #removing existing file
        print("Initiating modify_file_s3 - removing existing file!")
        s3.delete_object(
            Bucket = environ.get("AWS_BUCKET_NAME"),
            Key = file_name
        )
        #replace with new file
        s3.upload_fileobj(
            file,
            environ.get("AWS_BUCKET_NAME"),
            file_name
        )
    except Exception as e:
        message = "Failed to modify {} file with error {}".format(file_name,str(e))
        return False
    else:
        message = 'Successfully modified file'
        if not modify_file_rds(file_name,file_desc,email):
            return False
    print(message)
    return True

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS