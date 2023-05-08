from nameko.rpc import rpc
from dotenv import load_dotenv
import os
import pymysql
from passlib.hash import pbkdf2_sha256
from UserDAO import UserDAO
from nameko.standalone.rpc import ServiceRpcProxy
import string
import random
from datetime import datetime, timedelta



current_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path="{}/.env".format(current_dir))

def rpc_proxy(service):
    config = {'AMQP_URI': os.getenv('AMQP_URI')}
    return ServiceRpcProxy(service, config)

class UsersService:
    name = "users_service"
    
    @rpc
    def get_user(self, username, password):
        __userDao = UserDAO()
        user = {}
        roles=[]

        #pas = True 
        pas = UsersService.check_user_password(username,password)
        if pas:
            #Table User
            user = __userDao.getUserUsername(username)
            #Table user_role_module
            roleModule = __userDao.getUserRoleModule(user.get("id"))

            with rpc_proxy('symbols_service') as rpc:
                for module in roleModule:
                    moduleName = rpc.get_module_name(module.get("Module_id"))
                    roleName = __userDao.getRole(module.get("Roles_id"))
                    roles.append({"module":moduleName,"role":roleName.get("name")})
            
            user["roles"]= roles
            del user['id']
            #Close db conection
            __userDao.close()

            return user

        #Close db conection
        __userDao.close()
        
        return user
 
    @staticmethod
    def check_user_password(username, password):
        if(username=="guest" and password=="guest"):
            return True

        __userDao = UserDAO()

        try:
            data= __userDao.getUserPassword(username)
        except:
            data= {}
     
        #Close db conection
        __userDao.close()

        if len(data) > 0:
            if (pbkdf2_sha256.verify(password, data.get("password"))):
                #if data.get("password")==password:
                return True
            return False        
        
        return False

###########
    @rpc
    def get_user_check_password(self, username, password):
        validPass=UsersService.check_user_password(username, password)
        if validPass:
            user = UsersService.get_user(self,username,password)
            return user

        return {}

    @rpc
    def get_all_users(self, username):
        __userDao = UserDAO()
        userList = __userDao.getAllUsers(username)

        for user in userList:
            roles=[]
            #Table user_role_module
            roleModule = __userDao.getUserRoleModule(user.get("id"))

            with rpc_proxy('symbols_service') as rpc:
                for module in roleModule:
                    moduleName = rpc.get_module_name(module.get("Module_id"))
                    roleName = __userDao.getRole(module.get("Roles_id"))
                    roles.append({"module":moduleName,"role":roleName.get("name")})  
                
            user["roles"]= roles
            del user['id']

        __userDao.close()
             
        return userList

    @rpc
    def modify_user_profile(self, previousUsername, newUsername, fullname, email, roles):
        __userDao = UserDAO()

        userID=__userDao.getUserID(previousUsername).get("id")

        __userDao.updateUserProfile(userID, newUsername, fullname, email)
        
        __userDao.deleteUserRoleModule(userID)

        for roleModule in roles: 
            with rpc_proxy('symbols_service') as rpc:
                moduleID = rpc.get_module_id(roleModule.get("module")).get("id")
            roleID=__userDao.getRoleID(roleModule.get("role")).get("id")
            
            __userDao.insertUserRoleModule(userID, moduleID, roleID)
        
        __userDao.close()



    @rpc
    def change_password(self, username, oldPassword, newPassword):
        __userDao = UserDAO()
        #Missing encrypt process

        correct = UsersService.check_user_password(username, oldPassword)
        if(correct):
            userID=__userDao.getUserID(username).get("id")
            hash = pbkdf2_sha256.encrypt(newPassword, rounds=20000, salt_size=16)

            __userDao.updateUserPassword(userID, hash)
        
        __userDao.close()
        return correct

    @rpc
    def add_user(self, username, fullname, email, password, roles):
        __userDao = UserDAO()

        hash = pbkdf2_sha256.encrypt(password, rounds=20000, salt_size=16)

        __userDao.insertUser(username, fullname, email, hash)

        userID= __userDao.getUserID(username).get("id")
        for roleModule in roles: 
            with rpc_proxy('symbols_service') as rpc:
                moduleID = rpc.get_module_id(roleModule.get("module")).get("id")
                roleID=__userDao.getRoleID(roleModule.get("role")).get("id")
            
            __userDao.insertUserRoleModule(userID, moduleID, roleID)

        __userDao.close()

    @rpc
    def exists_username(self, username):
        __userDao = UserDAO()
      
        userID =__userDao.getUserID(username)
       
        __userDao.close()

        if userID is None:
            return True

        return False

    @rpc
    def exists_role(self, role):
        __userDao = UserDAO()
      
        roleID =__userDao.getRoleID(role)
       
        __userDao.close()

        if roleID is None:
            return False

        return True


    @rpc
    def delete_user(self, username):
        __userDao = UserDAO()
        
        userID=__userDao.getUserID(username).get("id")

        __userDao.deleteUserRoleModule(userID)

        __userDao.deleteUser(userID)

        __userDao.close()


    @rpc
    def new_user_session(self, username):
        __userDao = UserDAO()
      
        userID =__userDao.getUserID(username).get("id")
        auth_time=datetime.now().strftime("%d-%b-%Y (%H:%M:%S.%f)")
        token=UsersService.token_generator()

        exists=__userDao.getUserSessionToken(token)
        while exists is not None:
            token=UsersService.token_generator()
            exists=__userDao.getUserSessionToken(token)

        try:
            __userDao.deleteUserSessionToken(userID)
        except:
            pass

        __userDao.insertUserSessionToken(userID, token, auth_time)
        
        __userDao.close()

        return token


    @rpc
    def check_user_session(self, token):
        __userDao = UserDAO()
      
        sessionData=__userDao.getUserSessionToken(token)
        
        if sessionData is None:
            return ""

        auth_time=datetime.strptime(sessionData.get("datatime"), "%d-%b-%Y (%H:%M:%S.%f)")   
        current_time=datetime.now()

        elapsed_time=current_time-auth_time   
        if(elapsed_time > timedelta(hours=1)):
            __userDao.deleteUserSessionToken(sessionData.get("User_id"))
            return ""

        user=__userDao.getUserSession(sessionData.get("User_id"))
        roleModule = __userDao.getUserRoleModule(sessionData.get("User_id"))
        roles=[]
        with rpc_proxy('symbols_service') as rpc:
            for module in roleModule:
                moduleName = rpc.get_module_name(module.get("Module_id"))
                roleName = __userDao.getRole(module.get("Roles_id"))
                roles.append({"module":moduleName,"role":roleName.get("name")})
            
        user["roles"]= roles
            
        __userDao.close()

        return user


    @staticmethod
    def token_generator(size=20, chars=string.ascii_lowercase + string.ascii_uppercase + string.digits):
        return ''.join(random.choice(chars) for _ in range(size))