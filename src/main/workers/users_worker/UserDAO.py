from DbHelp.DbHelper import DbHelper


class UserDAO(object):
   __db = None

   def __init__(self):
      self.__db = DbHelper()
    
   def close(self):
      self.__db.close()

   def getUsers(self):
      return self.__db.query("SELECT * FROM User", None).fetchall()

   def getAllUsers(self, username):
      return self.__db.query("SELECT id, username, full_name, email FROM User WHERE User.username <> %s AND User.username <> 'QATeam' AND User.username <> 'admin' AND User.username <> 'guest'", username).fetchall()
       
   def getUserUsername(self, username):
      return self.__db.query("SELECT id, username, full_name, email FROM User WHERE User.username =%s", username).fetchone()

   def getUserSession(self, id):
      return self.__db.query("SELECT username, full_name, email FROM User WHERE User.id =%s", id).fetchone()

   def getUserID(self, username):
      return self.__db.query("SELECT id FROM User WHERE User.username =%s", username).fetchone()

   def getUserRoleModule(self, userid):
      return self.__db.query("SELECT Module_id, Roles_id FROM user_role_module WHERE user_role_module.User_id = %s", userid).fetchall()
    
   def getUserPassword(self, username):
      return self.__db.query("SELECT password FROM User WHERE User.username = %s", username).fetchone()
    
   def getRole(self, roleID):
      return self.__db.query("SELECT name FROM Roles WHERE Roles.id = %s", roleID).fetchone()
    
   def getRoleID(self, roleName):
      return self.__db.query("SELECT id FROM Roles WHERE Roles.name = %s", roleName).fetchone()
   
   def getUserSessionToken(self, token):
      return self.__db.query("SELECT User_id, datatime FROM user_session_time WHERE user_session_time.token = %s", token).fetchone()
 
   ################# INSERTS #################

   def insertUser(self, username, fullname, email, password):
      return self.__db.query("INSERT INTO User (username, full_name, email, password) VALUES (%s, %s, %s, %s)", (username, fullname, email, password))
 
   def insertUserRoleModule(self, userID, Module_id, Roles_id):
      return self.__db.query("INSERT INTO user_role_module (User_id, Module_id, Roles_id) VALUES (%s, %s, %s)", (userID, Module_id, Roles_id))
 
   def insertUserSessionToken(self, userID, token, datatime):
      return self.__db.query("INSERT INTO user_session_time (User_id, token, datatime) VALUES (%s, %s, %s)", (userID, token, datatime))


   ########### Update methods ###########

   def updateUserPassword(self, id, passwordNew):
      return self.__db.query("UPDATE User SET password=%s WHERE User.id=%s", (passwordNew, id))
   
   def updateUserProfile(self, userID, newusername, fullname, email):
      return self.__db.query("UPDATE User SET username=%s, full_name=%s, email=%s WHERE User.id=%s", (newusername, fullname, email, userID))
   

   ########### Delete methods ###########

   def deleteUser(self, id):
      return self.__db.query("DELETE FROM User WHERE id= %s", (id))
   
   def deleteUserRoleModule(self, id):
      return self.__db.query("DELETE FROM user_role_module WHERE User_id= %s", (id))
   
   def deleteUserSessionToken(self, User_id):
      return self.__db.query("DELETE FROM user_session_time WHERE User_id= %s", (User_id))

