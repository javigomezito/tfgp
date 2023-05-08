from flask import Flask, render_template, request, redirect, url_for, session
from nameko.standalone.rpc import ServiceRpcProxy
from dotenv import load_dotenv
import os
import pymysql
import json
import math

current_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path="{}/.env".format(current_dir))


app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")


def rpc_proxy(service):
    config = {'AMQP_URI': os.getenv('AMQP_URI')}
    return ServiceRpcProxy(service, config)


@app.route('/')
def Index():
    return render_template('login.html', show='login')

@app.route('/login', methods=['POST'])
def login():
    content = request.json
    #print(content)
    
    with rpc_proxy('users_service') as rpc:
        user = rpc.get_user(content.get('username'), content.get('password'))
        if len(user) > 1 :
            token=rpc.new_user_session(content.get('username'))
    
    if len(user) < 1 :
        return json.dumps({'success': False}), 409, {'ContentType': 'application/json'}

    session['user'] = user
    session['search'] = False
    session['searchedText']=''
    #print(token)

    return json.dumps({'success': True, 'token': token}), 200, {'ContentType': 'application/json'}


##################################################################
################### Search metadata methods ######################
##################################################################

@app.route('/search/resources', methods=['GET', 'POST'])
def searchRes():
    content = request.json
    print(content)
    
    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        
            if(user.get("roles")[0].get("role") == 'Guest' ):
                return json.dumps({'success': False, 'reason': 'Guest users are not allowed to use console commands.'}), 400, {'ContentType': 'application/json'}

        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}

    try:
        session['tab'] = content.get('tab')    
    except:
        session['tab'] =''
    
    
    session['search']= True
    session['searchedData']=None
    session['searchedText']=content.get('text')
    
    with rpc_proxy('resources_service') as rpc:
        if(content.get('exact')):
            session['searchedData']=rpc.search_text(content.get('text'), "exact")
        else:
            session['searchedData']=rpc.search_text(content.get('text'), "flexible")
    print(session['searchedData'])
    return json.dumps({'success': True, "response": session['searchedData']}), 200, {'ContentType': 'application/json'}
    
@app.route('/search/modules', methods=['GET', 'POST'])
def searchMod():
    #user = request.args['user']
    content = request.json
    print(content)
   
    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        
            if(user.get("roles")[0].get("role") == 'Guest' ):
                return json.dumps({'success': False, 'reason': 'Guest users are not allowed to use console commands.'}), 400, {'ContentType': 'application/json'}

        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}

    try:
        session['tab'] = content.get('tab')    
    except:
        session['tab'] =''
    
    session['search']= True
    session['searchedData']=None
    session['searchedText']=content.get('text')
    
    with rpc_proxy('symbols_service') as rpc:
        if(content.get('exact')):
            session['searchedData']=rpc.search_text("modules", content.get('text'), "exact")
        else:
            session['searchedData']=rpc.search_text("modules", content.get('text'), "flexible")
    return json.dumps({'success': True, "response": session['searchedData']}), 200, {'ContentType': 'application/json'}
    
@app.route('/search/symbols', methods=['GET', 'POST'])
def searchSym(): 
    content = request.json
    print(content)
    
    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        
            if(user.get("roles")[0].get("role") == 'Guest' ):
                return json.dumps({'success': False, 'reason': 'Guest users are not allowed to use console commands.'}), 400, {'ContentType': 'application/json'}

        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}

    try:
        session['tab'] = content.get('tab')    
    except:
        session['tab'] =''
    
    session['search']= True
    session['searchedData']=None
    session['searchedText']=content.get('text')

    with rpc_proxy('symbols_service') as rpc:
        if(content.get('exact')):
            session['searchedData']=rpc.search_text("symbols", content.get('text'), "exact")
        else:
            session['searchedData']=rpc.search_text("symbols", content.get('text'), "flexible")
    return json.dumps({'success': True, "response": session['searchedData']}), 200, {'ContentType': 'application/json'}
        
@app.route('/search/categories', methods=['GET', 'POST'])
def searchCat():
    #user = request.args['user']
    content = request.json
    print(content)
    
    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        
            if(user.get("roles")[0].get("role") == 'Guest' ):
                return json.dumps({'success': False, 'reason': 'Guest users are not allowed to use console commands.'}), 400, {'ContentType': 'application/json'}

        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}

    try:
        session['tab'] = content.get('tab')    
    except:
        session['tab'] =''
    
    session['search']= True
    session['searchedData']=None
    session['searchedText']=content.get('text')
    
    with rpc_proxy('symbols_service') as rpc:
        if(content.get('exact')):
            session['searchedData']=rpc.search_text("categories", content.get('text'), "exact")
        else:
            session['searchedData']=rpc.search_text("categories", content.get('text'), "flexible")
    return json.dumps({'success': True, "response": session['searchedData']}), 200, {'ContentType': 'application/json'}
        
@app.route('/search/indexes', methods=['GET', 'POST'])
def searchInd():
    #user = request.args['user']
    content = request.json
    print(content)
    
    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        
            if(user.get("roles")[0].get("role") == 'Guest' ):
                return json.dumps({'success': False, 'reason': 'Guest users are not allowed to use console commands.'}), 400, {'ContentType': 'application/json'}

        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}

    try:
        session['tab'] = content.get('tab')    
    except:
        session['tab'] =''
    
    session['search']= True
    session['searchedData']=None
    session['searchedText']=content.get('text')
    
    with rpc_proxy('symbols_service') as rpc:
        if(content.get('exact')):
            session['searchedData']=rpc.search_text("indexes", content.get('text'), "exact")
        else:
            session['searchedData']=rpc.search_text("indexes", content.get('text'), "flexible")
            
    return json.dumps({'success': True, "response": session['searchedData']}), 200, {'ContentType': 'application/json'}

    
###############################################################
################### Add metadata methods ######################
###############################################################
@app.route('/add/symbol', methods=['POST'])
def addSymbol():
    content = request.json    
    #print(content) 

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    


    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    moduleInUserModules=False
    for role in user.get("roles"):
        if (content.get("module") == role.get("module") or role.get("module")=='All'):
           moduleInUserModules=True

    if(moduleInUserModules):
        is_validated=0
        is_indexed=0
        insertable = False
        
        with rpc_proxy('symbols_service') as rpc:
            insertable = rpc.exists_symbol(content.get("name"))
            if(insertable):
                rpc.add_symbol_namedParams(content.get("name"), content.get("definition"), content.get("unit"), is_validated, is_indexed, content.get("module"), content.get("category"), content.get("ProjectTypeOfValue"), content.get("ProgrammingLanguageSymbolType"))
        
        if(insertable):
            return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
        return json.dumps({'success': False, "reason": "Already defined"}), 409, {'ContentType': 'application/json'}

    else:
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}


@app.route('/add/index', methods=['POST'])
def addIndex():
    content = request.json
    #print(content) 

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False}), 401, {'ContentType': 'application/json'}
    
    insertable = False
        
    with rpc_proxy('symbols_service') as rpc:
        insertable = rpc.exists_index(content.get("name"))
        if(insertable):
            rpc.add_index_namedParams(content.get("name"), content.get("definition"))
        
    if(insertable):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
    return json.dumps({'success': False, "reason": "Already defined"}), 409, {'ContentType': 'application/json'}


@app.route('/add/module', methods=['POST'])
def addModule():
    content = request.json
    print(content) 

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
      
    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False}), 401, {'ContentType': 'application/json'}
     
    insertable = False    
    with rpc_proxy('symbols_service') as rpc:
        insertable = rpc.exists_module(content.get("name"))
        if(insertable):
            rpc.add_module_namedParams(content.get("name"))
        
    if(insertable):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
    return json.dumps({'success': False, "reason": "Already defined"}), 409, {'ContentType': 'application/json'}
        

@app.route('/add/category', methods=['POST'])
def addCategory():
    content = request.json
    print(content)   
    
    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}  

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False}), 401, {'ContentType': 'application/json'}

    insertable = False
        
    with rpc_proxy('symbols_service') as rpc:
        insertable = rpc.exists_category(content.get("name"))
        if(insertable):
            level = 1
            Super_Category_id=None
            rpc.add_category_namedParams(content.get("name"), level, Super_Category_id)
        
    if(insertable):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
    return json.dumps({'success': False, "reason": "Already defined"}), 409, {'ContentType': 'application/json'}


@app.route('/add/subcategory', methods=['POST'])
def addSubCategory():
    content = request.json
    print(content)

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False}), 401, {'ContentType': 'application/json'}

    insertable = False
        
    with rpc_proxy('symbols_service') as rpc:
        insertable = not rpc.exists_category(content.get("supercategory"))
        
        if(insertable):
            level = 2
            Super_Category_id=rpc.getSuperCategoryID(content.get("supercategory"))
            for category in content.get("categories"):
                alreadyDefined = rpc.exists_category(category)
                if(alreadyDefined):
                    rpc.add_category_namedParams(category, level, Super_Category_id)
        
    if(insertable):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
    return json.dumps({'success': False, "reason": "Super-Category not defined"}), 409, {'ContentType': 'application/json'}


@app.route('/add/acronym', methods=['POST'])
def addAcronym():
    content = request.json
    print(content)   

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False}), 401, {'ContentType': 'application/json'}

    insertable = False
        
    with rpc_proxy('resources_service') as rpc:
        insertable = rpc.exists_acronym(content.get("letters"))
        if(insertable):
            rpc.add_acronym(content.get("letters"), content.get("meaning"))
        
    if(insertable):
        session['tab'] = "acronymsTab"
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
    return json.dumps({'success': False, "reason": "Already defined"}), 409, {'ContentType': 'application/json'}

@app.route('/add/adjective', methods=['POST'])
def addAdjective():
    content = request.json
    print(content)

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False}), 401, {'ContentType': 'application/json'}

    insertable = False
        
    with rpc_proxy('resources_service') as rpc:
        insertable = rpc.exists_adjective(content.get("adjective"))
        if(insertable):
            rpc.add_adjective(content.get("adjective"), content.get("usages"))
        
    if(insertable):
        session['tab'] = "adjectivesTab"
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
    return json.dumps({'success': False, "reason": "Already defined"}), 409, {'ContentType': 'application/json'}


@app.route('/add/semantic_rule', methods=['POST'])
def addSemanticRule():
    content = request.json
    print(content)   

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False}), 401, {'ContentType': 'application/json'}

    insertable = False
        
    with rpc_proxy('resources_service') as rpc:
        insertable = rpc.exists_semantic_rule(content.get("ruleforShort"))
        if(insertable):
            rpc.add_semantic_rule(content.get("ruleforShort"), content.get("explanation"))
        
    if(insertable):
        session['tab'] = "semanticRulesTab"
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
    return json.dumps({'success': False, "reason": "Already defined"}), 409, {'ContentType': 'application/json'}


@app.route('/add/user', methods=['POST'])
def addUser():
    content = request.json
    print(content)   

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False}), 401, {'ContentType': 'application/json'}

    insertable = False
    moduleInsertable = True
    roleInsertable = True
    with rpc_proxy('users_service') as rpc:
        insertable = rpc.exists_username(content.get("username"))
        
        #Check role and module are correct
        with rpc_proxy('symbols_service') as rpc2:
            for roleModule in content.get("roles"):
                if(moduleInsertable and roleInsertable):
                    moduleInsertable = not rpc2.exists_module(roleModule.get("module"))
                    roleInsertable = rpc.exists_role(roleModule.get("role"))
                
        if(insertable and roleInsertable and moduleInsertable):
            rpc.add_user(content.get("username"), content.get("fullname"), content.get("email"), content.get("password"), content.get("roles"))
        
    if(insertable and roleInsertable and moduleInsertable):
        session['tab'] = ""
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
    
    if(not insertable):
        return json.dumps({'success': False, "reason": "Invalid username, already defined"}), 409, {'ContentType': 'application/json'}

    return json.dumps({'success': False, "reason": "Invalid role or module"}), 400, {'ContentType': 'application/json'}


##################################################################
################### Modify metadata methods ######################
##################################################################
@app.route('/modify/symbol', methods=['PUT'])
def modifySymbol():
    content = request.json
    print(content)     

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    moduleInUserModules=False
    for role in user.get("roles"):
        if (content.get("moduleName") == role.get("module") or role.get("module")=='All'):
           moduleInUserModules=True

    if(moduleInUserModules):
        is_validated=0
        insertable=False

        with rpc_proxy('symbols_service') as rpc:
            insertable = rpc.exists_symbol(content.get("newName"))
            if(content.get("previousName")== content.get("newName")):
                insertable=True

            if(insertable):
                is_indexed= rpc.is_symbol_indexed(content.get("previousName"))
                rpc.modify_symbol_namedParams(content.get("previousName"), content.get("newName"), content.get("definition"), content.get("unit"), is_validated, is_indexed, content.get("moduleName"), content.get("categoryName"), content.get("PTOVName"), content.get("PLSTName"))
                
        if(insertable):
            return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
        return json.dumps({'success': False, "reason": "Already defined"}), 409, {'ContentType': 'application/json'}

    else:
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}


@app.route('/modify/symbol_modules', methods=['PUT'])
def modifySymbolModules():
    content = request.json
    print(content)   

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}

    
    moduleInUserModules=False
    for role in user.get("roles"):
        if (content.get("moduleName") == role.get("module") or role.get("module")=='All'):
           moduleInUserModules=True

    if(moduleInUserModules):
        
        with rpc_proxy('symbols_service') as rpc:
            rpc.modify_symbol_modules(content.get("name"), content.get("module"), content.get("secondary"))

        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

    else:
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}
    

@app.route('/modify/symbol_indexes', methods=['PUT'])
def modifySymbolIndexes():
    content = request.json
    print(content) 
    
    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    moduleInUserModules=False
    for role in user.get("roles"):
        if (content.get("moduleName") == role.get("module") or role.get("module")=='All'):
           moduleInUserModules=True

    if(moduleInUserModules):
        is_indexed=0

        if(content.get("is_indexed")=='True'):
            is_indexed=1
            indexes=content.get("indexes")
        else:
            indexes=[]
            
        with rpc_proxy('symbols_service') as rpc:
            rpc.modify_symbol_indexes(content.get("name"), is_indexed, indexes)

        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

    else:
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}


@app.route('/modify/index', methods=['PUT'])
def modifyIndex():
    content = request.json
    print(content) 
    
    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}

    insertable=False

    with rpc_proxy('symbols_service') as rpc:
        insertable = rpc.exists_index(content.get("newName"))
        if(content.get("previousName")== content.get("newName")):
            insertable=True

        if(insertable):
            rpc.modify_index_namedParams(content.get("previousName"), content.get("newName"), content.get("definition"))
    
    if(insertable):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
    return json.dumps({'success': False, "reason": "Already defined"}), 409, {'ContentType': 'application/json'}


@app.route('/modify/index_elements', methods=['PUT'])
def modifyIndexElements():
    content = request.json
    print(content)   

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}

    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}
    

    with rpc_proxy('symbols_service') as rpc:
        rpc.modify_index_elements(content.get("name"), content.get("elements"))

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


@app.route('/modify/module', methods=['PUT'])
def modifyModule():
    content = request.json
    print(content) 
    
    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}

    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}
    
    insertable=False

    with rpc_proxy('symbols_service') as rpc:
        insertable = rpc.exists_module(content.get("newName"))
        if(content.get("previousName")== content.get("newName")):
            insertable=True

        if(insertable):
            rpc.modify_module_namedParams(content.get("previousName"), content.get("newName"))
    
    if(insertable):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
    return json.dumps({'success': False, "reason": "Already defined"}), 409, {'ContentType': 'application/json'}


@app.route('/modify/category', methods=['PUT'])
def modifyCategory():
    content = request.json
    print(content)   

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}

    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False}), 401, {'ContentType': 'application/json'}

    insertable=False

    with rpc_proxy('symbols_service') as rpc:
        insertable = rpc.exists_category(content.get("newName"))
        if(content.get("previousName")== content.get("newName")):
            insertable=True

        if(insertable):
            rpc.modify_category_namedParams(content.get("previousName"), content.get("newName"))
    
    if(insertable):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
    return json.dumps({'success': False, "reason": "Already defined"}), 409, {'ContentType': 'application/json'}


@app.route('/modify/category/promote', methods=['PUT'])
def modifyPromoteCategory():
    content = request.json
    print(content)

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}

    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}

    insertable=False

    with rpc_proxy('symbols_service') as rpc:
        insertable = not rpc.exists_category(content.get("name"))
        
        if(insertable):
            rpc.modify_promote_category_namedParams(content.get("name"))
    
    if(insertable):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
    return json.dumps({'success': False, "reason": "Already defined"}), 409, {'ContentType': 'application/json'}


@app.route('/modify/acronym', methods=['PUT'])
def modifyAcronym():
    content = request.json
    print(content) 
    
    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}   

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}

    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}

    insertable=False
    with rpc_proxy('resources_service') as rpc:
        insertable = rpc.exists_acronym(content.get("newLetters"))
        if(content.get("previousLetters")== content.get("newLetters")):
            insertable=True

        if(insertable):
            session['tab'] = "acronymsTab"
            rpc.modify_acronym(content.get("previousLetters"), content.get("newLetters"), content.get("meaning"))
    
    if(insertable):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
    return json.dumps({'success': False, "reason": "Already defined"}), 409, {'ContentType': 'application/json'}


@app.route('/modify/adjective', methods=['PUT'])
def modifyAdjective():
    content = request.json
    print(content)  

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}

    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}

    insertable=False
    with rpc_proxy('resources_service') as rpc:
        insertable = rpc.exists_adjective(content.get("newAdjective"))
        if(content.get("previousAdjective")== content.get("newAdjective")):
            insertable=True

        if(insertable):
            session['tab'] = "adjectivesTab"
            rpc.modify_adjective(content.get("previousAdjective"), content.get("newAdjective"), content.get("usages"))
    
    if(insertable):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
    return json.dumps({'success': False, "reason": "Already defined"}), 409, {'ContentType': 'application/json'}


@app.route('/modify/semantic_rule', methods=['PUT'])
def modifySemanticRule():
    content = request.json
    print(content)   

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}

    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}

    insertable=False
    with rpc_proxy('resources_service') as rpc:
        insertable = rpc.exists_semantic_rule(content.get("newRule"))
        if(content.get("previousRule")== content.get("newRule")):
            insertable=True

        if(insertable):
            session['tab'] = "semanticRulesTab"
            rpc.modify_semantic_rule(content.get("previousRule"), content.get("newRule"), content.get("explanation"))
    
    if(insertable):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
    return json.dumps({'success': False, "reason": "Already defined"}), 409, {'ContentType': 'application/json'}


@app.route('/modify/userProfile', methods=['PUT'])
def modifyUserProfile():
    content = request.json
    print(content)   

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    insertable = False
    moduleInsertable = True
    roleInsertable = True
    with rpc_proxy('users_service') as rpc:
        insertable = rpc.exists_username(content.get("newUsername"))
        if(content.get("newUsername")==content.get("previousUsername")):
            insertable=True
        
        #Check role and module are correct
        if(insertable):
            with rpc_proxy('symbols_service') as rpc2:
                for roleModule in content.get("roles"):
                    if(moduleInsertable and roleInsertable):
                        moduleInsertable = not rpc2.exists_module(roleModule.get("module"))
                        roleInsertable = rpc.exists_role(roleModule.get("role"))
                        
        if(insertable and roleInsertable and moduleInsertable):
            session['tab'] = ""
            newRoles= content.get("roles")

            if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
                newRoles= user.roles 
            
            rpc.modify_user_profile(content.get("previousUsername"), content.get("newUsername"), content.get("fullname"), content.get("email"), newRoles)
    
    if(insertable and roleInsertable and moduleInsertable):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
    
    if(not insertable):
        return json.dumps({'success': False, "reason": "Invalid username, already defined"}), 409, {'ContentType': 'application/json'}

    return json.dumps({'success': False, "reason": "Invalid role or module"}), 400, {'ContentType': 'application/json'}


@app.route('/modify/userPassword', methods=['PUT'])
def modifyUserPassword():
    content = request.json
    print(content)   

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}

    insertable=False
    with rpc_proxy('users_service') as rpc:
        insertable = not rpc.exists_username(content.get("username"))

        if(insertable):
            session['tab'] = ""
            changed=rpc.change_password(content.get("username"), content.get("previousPassword"), content.get("newPassword"))
    
    if(changed):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        
    return json.dumps({'success': False, "reason": "Username not found"}), 409, {'ContentType': 'application/json'}



##################################################################
################### Delete metadata methods ######################
##################################################################
@app.route('/delete/symbol', methods=['DELETE'])
def deleteSymbol():
    content = request.json
    print(content)   

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    moduleInUserModules=False
    for role in user.get("roles"):
        if (content.get("module") == role.get("module") or role.get("module")=='All'):
            if(role.get("role")=='Project Leader' or role.get("role")=='Module Supervisor' or role.get("role")=='General Supervisor'):
                moduleInUserModules=True

    if(moduleInUserModules):
        with rpc_proxy('symbols_service') as rpc:
            if(rpc.exists_symbol(content.get("name"))):
                return json.dumps({'success': False, "reason": "Symbol not found"}), 400, {'ContentType': 'application/json'}
            
            rpc.delete_symbol(content.get("name"))

        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

    else:
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}


@app.route('/delete/index', methods=['DELETE'])
def deleteIndex():
    content = request.json
    print(content) 
  
    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    deleteable=False
    with rpc_proxy('symbols_service') as rpc:
        if(rpc.exists_index(content.get("name"))):
            return json.dumps({'success': False, "reason": "Index not found"}), 400, {'ContentType': 'application/json'}

        deleteable = rpc.has_index_indexElements(content.get("name"))
        if(deleteable):
            rpc.delete_index(content.get("name"))
    if(deleteable):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
    
    return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}


@app.route('/delete/module', methods=['DELETE'])
def deleteModule():
    content = request.json
    print(content)   

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}
    
    deleteable=False

    with rpc_proxy('symbols_service') as rpc:
        if(rpc.exists_module(content.get("name"))):
            return json.dumps({'success': False, "reason": "Module not found"}), 400, {'ContentType': 'application/json'}

        deleteable = rpc.has_module_symbols(content.get("name"))
        if(deleteable):
            rpc.delete_module(content.get("name"))
    if(deleteable):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
    
    return json.dumps({'success': False, "reason": "Permission denied, module has symbols associated"}), 409, {'ContentType': 'application/json'}


@app.route('/delete/category', methods=['DELETE'])
def deleteCategory():
    content = request.json
    print(content)   

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}
    
    
    deleteable=False

    with rpc_proxy('symbols_service') as rpc:
        if(rpc.exists_category(content.get("name"))):
            return json.dumps({'success': False, "reason": "Category not found"}), 400, {'ContentType': 'application/json'}

        deleteable = rpc.has_category_symbols(content.get("name"))
        if(deleteable):
            rpc.delete_category(content.get("name"))
    if(deleteable):
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
    
    return json.dumps({'success': False, "reason": "Permission denied, category has symbols associated"}), 409, {'ContentType': 'application/json'}


@app.route('/delete/acronym', methods=['DELETE'])
def deleteAcronym():
    content = request.json
    print(content) 

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}
    
    deleteable=False
    with rpc_proxy('resources_service') as rpc:
        deleteable = not rpc.exists_acronym(content.get("letters"))
        if(deleteable):
            rpc.delete_acronym(content.get("letters"))
    if(deleteable):
        session['tab'] = "acronymsTab"
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
    
    return json.dumps({'success': False, "reason": "Permission denied, acronym not found"}), 409, {'ContentType': 'application/json'}


@app.route('/delete/adjective', methods=['DELETE'])
def deleteAdjective():
    content = request.json 
    print(content) 

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}
    
    deleteable=False
    with rpc_proxy('resources_service') as rpc:
        deleteable = not rpc.exists_adjective(content.get("adjective"))
        if(deleteable):
            rpc.delete_adjective(content.get("adjective"))
    if(deleteable):
        session['tab'] = "adjectivesTab"
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
    
    return json.dumps({'success': False, "reason": "Permission denied, adjective not found"}), 409, {'ContentType': 'application/json'}


@app.route('/delete/semantic_rule', methods=['DELETE'])
def deleteSemanticRule():
    content = request.json
    print(content)
    
    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}
    
    deleteable=False
    with rpc_proxy('resources_service') as rpc:
        deleteable = not rpc.exists_semantic_rule(content.get("ruleforShort"))
        if(deleteable):
            rpc.delete_semantic_rule(content.get("ruleforShort"))
    if(deleteable):
        session['tab'] = "semanticRulesTab"
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
    
    return json.dumps({'success': False, "reason": "Permission denied, semantic rule not found"}), 409, {'ContentType': 'application/json'}


@app.route('/delete/user', methods=['DELETE'])
def deleteUser():
    content = request.json
    print(content)
    
    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}
    
    deleteable=False
    with rpc_proxy('users_service') as rpc:
        deleteable = not rpc.exists_username(content.get("username"))
        if(deleteable):
            rpc.delete_user(content.get("username"))
    if(deleteable):
        session['tab'] = ""
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
    
    return json.dumps({'success': False, "reason": "Permission denied, username not found"}), 409, {'ContentType': 'application/json'}


#####################################################################
#################### Validate metadata methods ######################
#####################################################################
@app.route('/validate/symbol', methods=['PUT'])
def validateSymbol():
    content = request.json
    print(content)

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    #print(content.get("module"))
    print(user.get("roles"))

    moduleInUserModules=False
    for role in user.get("roles"):
        if (content.get("module") == role.get("module") or role.get("module")=='All'):
            if (role.get("role")=='Module Supervisor' or role.get("role")=='Project Leader' or role.get("role")=='General Supervisor'): 
                moduleInUserModules=True

    if(moduleInUserModules):

        with rpc_proxy('symbols_service') as rpc:
            if(rpc.exists_symbol(content.get("name"))):
                return json.dumps({'success': False, "reason": "Symbol not found"}), 400, {'ContentType': 'application/json'}

            rpc.validate_symbol(content.get("name"))

        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

    else:
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}


@app.route('/validate/index', methods=['PUT'])
def validateIndex():
    content = request.json
    print(content)  

    try:
        user = session['user']  
    except:
        try:
            with rpc_proxy('users_service') as rpc:
                user = rpc.check_user_session(content.get('token'))
            if(user==""):
                return json.dumps({'success': False, 'reason': 'Token is not correct or session expired'}), 400, {'ContentType': 'application/json'}
        except:
            return json.dumps({'success': False, 'reason': 'Token needed'}), 400, {'ContentType': 'application/json'}
    

    if(user.get("roles")[0].get("role") == 'Guest' ):
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    
    if(user.get("roles")[0].get("role") != 'Project Leader' and user.get("roles")[0].get("role") != 'General Supervisor'):
        return json.dumps({'success': False, "reason": "Permission denied"}), 401, {'ContentType': 'application/json'}
    
    
    with rpc_proxy('symbols_service') as rpc:
        if(rpc.exists_index(content.get("name"))):
            return json.dumps({'success': False, "reason": "Index not found"}), 400, {'ContentType': 'application/json'}

        rpc.validate_index(content.get("name"))

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

#########################################################################
######################## Generic get methods ############################
#########################################################################

#
# This methods render templates and call workers to get the information they need to display.
# They are not accessible from shell
#

# Get the main project view with the logo, name, header, and description of the project.
@app.route('/general', methods=['GET'])
def general():
    try:
        user = session['user']  
    except:
        return json.dumps({'success': False, 'reason': 'Not accessible from shell'}), 400, {'ContentType': 'application/json'}
    
    session['tab'] = ''
       
    name=''
    header=''
    description=''
    logo=''
    try:
        f = open("./static/css/projectInfo/name.txt", "r")
        name=f.read()
        f.close()
    except:
        pass
        
    try:
        f = open("./static/css/projectInfo/header.txt", "r")
        header=f.read().replace("\n", "\\n")
        f.close()
    except:
        pass

    try:
        f = open("./static/css/projectInfo/description.txt", "r")
        description=f.read().replace("\n", "\\n")
        f.close()
    except:
        pass
    
    try:
        f = open("./static/css/projectInfo/logo.txt", "r")
        logo=f.read().replace("\n", "")
        f.close()
    except:
        pass

    dataDictionary = {"name": name, "header": header, "description": description, "logo": logo}
    #print(dataDictionary)

    return render_template('general.html', show='general', user = json.dumps(user), dataDictionary=json.dumps(dataDictionary))

# Get user's settings.
# Project Leader and General Supervisors get the list of users, project general information,
# Programming Language Symbol Type and Project Type Of Value, in order to be able to modify it if needed.
@app.route('/settings', methods=['GET'])
def settings():
    try:
        user = session['user']  
    except:
        return json.dumps({'success': False, 'reason': 'Not accessible from shell'}), 400, {'ContentType': 'application/json'}

    if user.get("roles")[0].get("role") == "Guest":
        return redirect(url_for('general'))
    
    dataDictionary={}
    userList=[]
    PLSTList=[]
    PTOVList=[]
    users_pagination=0
    projectName=''
    projectHeader=''
    projectDescription=''
    projectLogo=''

    with rpc_proxy('symbols_service') as rpc:
        moduleList = rpc.get_all_modules()
        PTOVList = rpc.get_all_PTOV()
        PLSTList = rpc.get_all_PLST()

    if(user.get("roles")[0].get("role") == 'Project Leader' or user.get("roles")[0].get("role") == 'General Supervisor'):             
        with rpc_proxy('users_service') as rpc:
            userList=rpc.get_all_users(user.get("username"))

        try:
            f = open("./static/css/projectInfo/name.txt", "r")
            projectName=f.read()
            f.close()
        except:
            pass
            
        try:
            f = open("./static/css/projectInfo/header.txt", "r")
            projectHeader=f.read().replace("\n", "\\n")
            f.close()
        except:
            pass

        try:
            f = open("./static/css/projectInfo/description.txt", "r")
            projectDescription=f.read().replace("\n", "\\n")
            f.close()
        except:
            pass
        
        try:
            f = open("./static/css/projectInfo/logo.txt", "r")
            projectLogo=f.read().replace("\n", "")
            f.close()
        except:
            pass

    dataDictionary = {"modules": moduleList, "ProjectTypeOfValue": PTOVList, "ProgrammingLanguageSymbolType": PLSTList, "userList": userList, "projectName": projectName, "projectHeader": projectHeader, "projectDescription": projectDescription, "projectLogo": projectLogo}
    #print(dataDictionary)
    users_pagination = math.ceil(len(dataDictionary.get("userList"))/4)
    
    return render_template('settings.html', show='general', user = json.dumps(user), dataDictionary=json.dumps(dataDictionary), users_pagination=users_pagination)

# Get resources.
# Acronyms, Adjectives and Semantic Rules.
@app.route('/resources', methods=['GET'])
def resources():
    try:
        user = session['user']  
    except:
        return json.dumps({'success': False, 'reason': 'Not accessible from shell'}), 400, {'ContentType': 'application/json'}

    tab = session['tab']
    searchedText=''
    if(session['search']):
        dataDictionary=session['searchedData']
        session['search'] = False
        searchedText=session['searchedText']
    else:
        with rpc_proxy('resources_service') as rpc:
            acronymsList = rpc.get_all_acronyms()
            adjectivesList = rpc.get_all_adjectives()
            rulesList = rpc.get_all_semantic_rules()
        
        dataDictionary = {"acronyms": acronymsList, "adjectives":adjectivesList, "semantic_rules":rulesList}
    
    #print(dataDictionary)

    #pagintation
    acronyms_pagination = math.ceil(len(dataDictionary.get("acronyms"))/4)
    adjectives_pagination = math.ceil(len(dataDictionary.get("adjectives"))/4)
    rules_pagination = math.ceil(len(dataDictionary.get("semantic_rules"))/4)

    return render_template('resources.html', show='resources', user = json.dumps(user), dataDictionary=json.dumps(dataDictionary), acronyms_pagination=acronyms_pagination, adjectives_pagination=adjectives_pagination, rules_pagination=rules_pagination, tabulation = json.dumps(tab), searchedText= searchedText)

# Get modules.
# Also gets the count of associated symbols that are linked to them.
@app.route('/modules', methods=['GET'])
def modules():
    try:
        user = session['user']  
    except:
        return json.dumps({'success': False, 'reason': 'Not accessible from shell'}), 400, {'ContentType': 'application/json'}

    searchedText=''
    if(session['search']):
        moduleList=session['searchedData']
        session['search'] = False
        searchedText=session['searchedText']
    else:
        with rpc_proxy('symbols_service') as rpc:
            moduleList = rpc.get_all_modules_and_SymbolCount()
    
    #print(moduleList)
    #pagintation
    validated_pagination = math.ceil(len(moduleList)/4)

    return render_template('modules.html', show='modules', user = json.dumps(user), dataDictionary=json.dumps(moduleList), validated_pagination=validated_pagination, searchedText= searchedText)

# Get indexes and all their information
@app.route('/indexes', methods=['GET'])
def indexes():
    try:
        user = session['user']  
    except:
        return json.dumps({'success': False, 'reason': 'Not accessible from shell'}), 400, {'ContentType': 'application/json'}

    tab = session['tab']
    searchedText=''
    if(session['search']):
        indexList=session['searchedData']
        session['search'] = False
        searchedText=session['searchedText']
    else:
        with rpc_proxy('symbols_service') as rpc:
            indexList = rpc.get_all_indexes()

    #print(indexList)
    #pagintation
    validated_pagination = math.ceil((len(indexList.get("validated")))/4)
    nonvalidated_pagination = math.ceil((len(indexList.get("non_validated")))/4)

    return render_template('indexes.html', show='indexes', user = json.dumps(user), dataDictionary=json.dumps(indexList), validated_pagination=validated_pagination,nonvalidated_pagination=nonvalidated_pagination, tabulation = json.dumps(tab), searchedText= searchedText)

# Get symbols and all their information
@app.route('/symbols', methods=['GET'])
def symbols():
    try:
        user = session['user']  
    except:
        return json.dumps({'success': False, 'reason': 'Not accessible from shell'}), 400, {'ContentType': 'application/json'}

    tab = session['tab']
    searchedText=''
    with rpc_proxy('symbols_service') as rpc:
        if(session['search']):
            symbolList=session['searchedData']
            session['search'] = False
            searchedText=session['searchedText']
        else:
            symbolList = rpc.get_all_symbols()

        moduleList = rpc.get_all_modules()
        categoryList = rpc.get_all_categories()
        PTOVList = rpc.get_all_PTOV()
        PLSTList = rpc.get_all_PLST()
        indexesList = rpc.get_all_indexesNamesValidated()

    '''
    print(symbolList)
    print(moduleList)
    print(categoryList)
    print(PTOVList)
    print(PLSTList)
    '''
    categoryListValid=[]
    for category in categoryList:
        if category.get("is_validated") == 1:
            categoryListValid.append(category)

    dataDictionary = {"symbols": symbolList, "modules": moduleList, "categories": categoryListValid, "ProjectTypeOfValue": PTOVList, "ProgrammingLanguageSymbolType": PLSTList, "indexes": indexesList}

    #print(dataDictionary)
    #pagintation
    validated_pagination = math.ceil((len(symbolList.get("validated")))/4)
    nonvalidated_pagination = math.ceil((len(symbolList.get("non_validated")))/4)
    
    return render_template('symbols.html', show='symbols', user = json.dumps(user), dataDictionary=dataDictionary,dataDictionary2=json.dumps(dataDictionary), validated_pagination=validated_pagination,nonvalidated_pagination=nonvalidated_pagination, tabulation = json.dumps(tab), searchedText= searchedText)

# Get categories.
# Also gets the count of associated symbols that are linked to them.
@app.route('/categories', methods=['GET'])
def categories():
    try:
        user = session['user']  
    except:
        return json.dumps({'success': False, 'reason': 'Not accessible from shell'}), 400, {'ContentType': 'application/json'}

    searchedText=''
    if(session['search']):
        categoryList=session['searchedData']
        session['search'] = False
        searchedText=session['searchedText']
    else:
        with rpc_proxy('symbols_service') as rpc:
            categoryList = rpc.get_all_categories_and_counts()

    #print(categoryList)
    #pagintation
    validated_pagination = math.ceil(len(categoryList)/4)
    
    return render_template('categories.html', show='categories', user = json.dumps(user), dataDictionary=json.dumps(categoryList), validated_pagination=validated_pagination, searchedText= searchedText)

#########################################################################
############### SonarQube plugin integration methods ####################
#########################################################################

#Obtain Symbols 
@app.route('/qaGetSymbolsDefinition', methods=['GET'])
def symbolsInfo():
    
    '''
    curl -X GET 'http://localhost:8080/qaGetSymbolsDefinition' -H "content-type: application/json" -H "Authorization: Bearer PGUcZgkN_y1DpWuodzzz" -d '{"symbols": ["paginationtest", "SymbolExample3", "example234"]}'

    '''
    content = request.json
    #print(content)
    #print(request.headers.get('Authorization').split(" ")[1])
    try:
        with rpc_proxy('users_service') as rpc:
            user = rpc.get_user("QATeam", request.headers.get('Authorization').split(" ")[1])
    except:
        user=""

    #check if user has permission role QA
    if len(user) < 1 :
        RequestedInformation= "Code 400: \nUser identification went wrong, check header Authorization"
        response = app.response_class(
        response=json.dumps(RequestedInformation),
        status=400,
        mimetype='application/json'
        )
        return response

    try:
        content.get('symbols')
    except:
        RequestedInformation= "Code 400: \nSymbols content identifier not found"
        response = app.response_class(
        response=json.dumps(RequestedInformation),
        status=400,
        mimetype='application/json'
        )
        return response

    with rpc_proxy('symbols_service') as rpc:
        RequestedInformation = rpc.get_symbols_information(content.get('symbols'))
    
    response = app.response_class(
        response=json.dumps(RequestedInformation),
        status=200,
        mimetype='application/json'
    )
    return response

#Information adding
@app.route('/qaAddSymbolsDefinition', methods=['POST'])
def addInformation():
    '''
    curl -X POST 'http://localhost:8080/qaAddSymbolsDefinition' -H "content-type: application/json" -H "Authorization: Bearer PGUcZgkN_y1DpWuodzzz" -d '{"symbols": [{"name":"newSymbolConsole1", "definition":"Example definition for console add", "unit": "N", "ProgrammingLanguageSymbolType": "Constant", "Category": "NewCategory"}, {"name":"newSymbolConsole2", "definition":"Another example definition from console", "unit": "Kg", "ProgrammingLanguageSymbolType": "Variable", "Category": "NewCategory"}], "module": "NewModule", "indexes": [{"indexName":"IndexConsole1", "definition":"Index definition console", "indexElements":["IndexElementExample1", "IndexElement2"]}, {"indexName":"IndexConsole2", "definition":"Index definition number two from console", "indexElements":["IndexElementExample2", "IndexElementExample3"]}]}'

    '''
    content = request.json
    #print(content)
    try:
        with rpc_proxy('users_service') as rpc:
            user = rpc.get_user("QATeam", request.headers.get('Authorization').split(" ")[1])
    except:
        user=""

    #check if user has permission role QA
    if len(user) < 1 :
        RequestedInformation= "Code 400: \nUser identification went wrong, check Authorization"
        response = app.response_class(
        response=json.dumps(RequestedInformation),
        status=400,
        mimetype='application/json'
        )
        return response

    with rpc_proxy('symbols_service') as rpc:
        RequestedInformation = rpc.add_symbols_information(content)
    
    if (RequestedInformation!="Success"):
        response = app.response_class(
        response=json.dumps(RequestedInformation),
        status=400,
        mimetype='application/json'
        )
        return response    
    
    response = app.response_class(
        response=json.dumps(RequestedInformation),
        status=200,
        mimetype='application/json'
    )
    return response

#########################################################################
########################## Logout method ################################
#########################################################################

#Logout method, clears user's session
@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect(url_for('Index'))



if __name__ == '__main__':
    app.run()
