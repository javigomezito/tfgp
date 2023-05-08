import pymysql.cursors
import pymysql
from dotenv import load_dotenv
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path="{}/.env".format(current_dir))



class DbHelper:

    __connection = None
    __cursor = None

    def __init__(self):
        
        self.__connection = pymysql.connect(host=os.getenv("HOST"),
                                            user =os.getenv("USER"),
                                            password = os.getenv("PASSWORD"),
                                            db = os.getenv("DB"),
                                            port = int(os.getenv("PORT")),
                                            cursorclass = pymysql.cursors.DictCursor)

        self.__cursor = self.__connection.cursor()
    
    def query(self, query, params):
       self.__cursor.execute(query, params)
       #Changes db
       self.__connection.commit() 
       return self.__cursor

    def close(self):
        self.__connection.close()