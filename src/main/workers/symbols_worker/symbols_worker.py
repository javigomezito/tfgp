from nameko.rpc import rpc
from dotenv import load_dotenv
import os
import pymysql
from passlib.hash import pbkdf2_sha256
from SymbolsDAO import SymbolsDAO

current_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path="{}/.env".format(current_dir))


class SymbolsService:
    name = "symbols_service"


    ##############################################################
    #################### Get methods #############################
    ##############################################################

    #Only returns the valid ones
    @rpc
    def get_symbols_information(self, symbolList):
        symbolsInfo = SymbolsService.get_symbols(symbolList)
        
        #Call functions to get indexes and categories information
        indexes = SymbolsService.get_indexes(symbolsInfo.get("indexes"))
        categories = SymbolsService.get_categories(symbolsInfo.get("categories"))
        
        response= {"symbols": symbolsInfo.get("symbols"), "modules": symbolsInfo.get("modules"), "indexes": indexes, "categories": categories}    

        return response

    @rpc
    def get_all_symbols(self):
        __symbolsDao = SymbolsDAO()
        
        #Get all symbols from DB
        symbolList = __symbolsDao.getAllSymbols()
        #Only get the information of the validated ones
        validSymbols = SymbolsService.get_symbols(symbolList)
        
        for symbol in validSymbols.get("symbols"):
            if((__symbolsDao.getSymbolIs_Indexed(symbol.get("name"))).get("is_indexed")==1):
                symbol["is_indexed"]='True'
            else:
                symbol["is_indexed"]='False'
        

        #Get the information of the non validated
        nonValidSymbols = SymbolsService.get_non_valid_symbols(symbolList)


        #Build response
        response= {"validated": validSymbols.get("symbols"), "non_validated": nonValidSymbols.get("symbols")}
        
        return response

    @rpc
    def get_all_modules(self):
        __symbolsDao = SymbolsDAO()
        
        #Get all symbols from DB
        moduleList = __symbolsDao.getAllModulesName()
        
        return moduleList

    @rpc
    def get_all_modules_and_SymbolCount(self):
        __symbolsDao = SymbolsDAO()
        moduleInfo=[]

        #Get all symbols from DB
        moduleList = __symbolsDao.getAllModulesName()
        for module in moduleList:
            moduleID = __symbolsDao.getModuleID(module.get("name"))
            secondarysymbolCount = __symbolsDao.getModuleSymbolsCount(moduleID.get("id")).get("COUNT(*)")
            mainsymbolCount = __symbolsDao.getMainModuleSymbolsCount(moduleID.get("id")).get("COUNT(*)")
            symbolCount= secondarysymbolCount+mainsymbolCount
            moduleInfo.append({"module_name": module.get("name"), "symbols": symbolCount})
        
        return moduleInfo

    @rpc
    def get_all_categories_and_counts(self):
        __symbolsDao = SymbolsDAO()
        categoryInfo=[]

        superCategoryList = __symbolsDao.getAllSuperCategories()
        for category in superCategoryList:

            superCategoryID = __symbolsDao.getCategoryID(category.get("name"))
            superSymbolCount = __symbolsDao.getCategorySymbolsCount(superCategoryID.get("id"))

            #subCategoryCount = __symbolsDao.getModuleSymbols(categoryID.get("id"))
            subCategoryList=[]

            subcategories = __symbolsDao.getAllSubCategories(superCategoryID.get("id"))
            for subcategory in subcategories:
                subCategoryID = __symbolsDao.getCategoryID(subcategory.get("name"))
                subSymbolCount = __symbolsDao.getCategorySymbolsCount(subCategoryID.get("id"))

                subCategoryList.append({"category_name": subcategory.get("name"), "symbols_count": subSymbolCount.get("COUNT(*)")})
        

            categoryInfo.append({"category_name": category.get("name"), "subcategories_count": len(subcategories), "symbols_count": superSymbolCount.get("COUNT(*)"), "subcategories": subCategoryList})
        
        return categoryInfo

    @rpc
    def get_all_indexes(self):
        __symbolsDao = SymbolsDAO()
        indexList={}
        #Get all indexes from DB
        indexListValidated = __symbolsDao.getAllIndexesValidated()
        indexListNonValidated = __symbolsDao.getAllIndexesNonValidated()
        
        for index in indexListValidated:
            indexElemID = __symbolsDao.getIndexHasElements(index.get("id"))
            indexElementList=[]

            #Get every index element
            for indexElem in indexElemID:
                indexElemName = __symbolsDao.getIndexElement(indexElem.get("IndexValue_id"))
                indexElementList.append(indexElemName.get("value_name"))
            
            
            indexSymbols= __symbolsDao.getIndexHasSymbol(index.get("id"))
            indexSymbolsList=[]

            for symbol in indexSymbols:
                symbolName = __symbolsDao.getSymbolByID(symbol.get("Symbol_id"))    
                indexSymbolsList.append(symbolName.get("name"))
                

            index["symbols"]=indexSymbolsList
            index["elements"]=indexElementList
            del index['id']
        
        
        for index in indexListNonValidated:
            indexElemID = __symbolsDao.getIndexHasElements(index.get("id"))

            indexElementList=[]

            #Get every index element
            for indexElem in indexElemID:
                indexElemName = __symbolsDao.getIndexElement(indexElem.get("IndexValue_id"))
                indexElementList.append(indexElemName.get("value_name"))
            

            indexSymbols= __symbolsDao.getIndexHasSymbol(index.get("id"))
            indexSymbolsList=[]

            for symbol in indexSymbols:
                symbolName = __symbolsDao.getSymbolByID(symbol.get("Symbol_id"))    
                indexSymbolsList.append(symbolName.get("name"))  


            index["symbols"]=indexSymbolsList
            index["elements"]=indexElementList
            del index['id']
            

        indexList={"validated": indexListValidated, "non_validated": indexListNonValidated}
        __symbolsDao.close()
        return indexList

    @rpc
    def get_all_indexesNamesValidated(self):
        __symbolsDao = SymbolsDAO()
        indexList=[]
        #Get all validated indexes from DB
        indexes = __symbolsDao.getAllIndexesValidated()

        for index in indexes:
            indexList.append(index.get("index_name"))  
            

        __symbolsDao.close()
        return indexList

    @rpc
    def get_all_categories(self):
        __symbolsDao = SymbolsDAO()
        
        #Get all categories from DB
        categoriesList = __symbolsDao.getAllCategories()
        
        __symbolsDao.close()
        return categoriesList

    @rpc
    def getSuperCategoryID(self, superCategoryName):
        __symbolsDao = SymbolsDAO()
        categoryID=None
        try:
            categoryID= __symbolsDao.getCategoryID(superCategoryName).get("id")
            category= __symbolsDao.getCategory(categoryID)
            if(category.get("level")==2):
                categoryID=None
        except:
            pass
        
        __symbolsDao.close()

        return categoryID

    @rpc
    def get_all_PTOV(self):
        __symbolsDao = SymbolsDAO()
        
        #Get all symbols from DB
        PTOVList = __symbolsDao.getAllProjectTypeOfValues()
        
        
        __symbolsDao.close()
        return PTOVList

    @rpc
    def get_all_PLST(self):
        __symbolsDao = SymbolsDAO()
        
        #Get all symbols from DB
        PLSTList = __symbolsDao.getAllProgrammingLanguageSymbolTypes()
        
        
        __symbolsDao.close()
        return PLSTList

    @staticmethod
    def get_symbols(symbolList):
        __symbolsDao = SymbolsDAO()
        #Initialize lists
        symbolsInfo = []
        modulesInfo = []
        categoryIdList = []
        indexesIdList=[]
        
        for currentSymbol in symbolList:
            try:
                indexesNameList = []
                #Get symbol first
                #Table Symbol
                try:
                    try:
                        symbol = __symbolsDao.getSymbolByName(currentSymbol)
                    except:
                        symbol = __symbolsDao.getSymbolByID(currentSymbol.get("id"))
                except:
                    symbol=""
                        
                #If the symbol exists in the table
                if len(symbol) > 0:
                    #Check if it is validated
                    if(symbol.get('is_validated')==1):
                        #Retrieve referenced missing data 
                        
                        #Get main's module name the symbol is attached to
                        mainModule= __symbolsDao.getModuleName(symbol.get("Module_id"))
                        
                        #Get the secondary modules the symbol is in includes main module 
                        attachedModules = SymbolsService.get_secondary_modules(symbol.get("id"), mainModule.get("name"))        
                        
                        #Adding modules to the list of modules, has to be unique
                        if len(mainModule) > 0:
                            if mainModule.get("name") not in modulesInfo:
                                modulesInfo.append(mainModule.get("name"))
                        
                        #Adding modules to the list of modules, has to be unique
                        if len(attachedModules) > 0:
                            for attachedModule in attachedModules:
                                if attachedModule not in modulesInfo:
                                    modulesInfo.append(attachedModule)
                        
                        #Get the Category name
                        #It is already validated
                        category = __symbolsDao.getCategoryName(symbol.get("Category_id"))
                        
                        #Get the ProgrammingLanguageSymbolType
                        #ProgrammingLST = SymbolsService.get_ProgrammingLanguageSymbolType(symbol.get("ProjectTypeOfValue_id"))
                        
                        PTOVName = __symbolsDao.getProjectTypeOfValue(symbol.get("ProjectTypeOfValue_id"))
                        PLSTName = __symbolsDao.getProgrammingLanguageSymbolType(symbol.get("ProgrammingLanguageSymbolType_id"))


                        #Get index names
                        #Table Symbol_has_Index
                        #Already validated indexes
                        idIndexList= __symbolsDao.getSymbolHasIndex(symbol.get("id"))
                        
                        for idIndex in idIndexList:
                            #Only index name to fill symbol information
                            indexName= __symbolsDao.getIndexName(idIndex.get("Index_id"))

                            #Index name list for this symbol    
                            if indexName.get("index_name") not in indexesNameList:
                                indexesNameList.append(indexName.get("index_name"))
                            
                            #Add list of indexes ids used to search for them later
                            if idIndex.get("Index_id") not in indexesIdList:
                                indexesIdList.append(idIndex.get("Index_id"))
                        

                        #Category ids to call a function below
                        categoryIdList.append(symbol.get("Category_id"))
                        
                        #Build the symbol dictionary 
                        symbol = { "name": symbol.get("name"), "definition": symbol.get("definition"), "unit" : symbol.get("unit"), "is_indexed" : symbol.get("is_indexed"), "indexes" : indexesNameList, "modules": {"main": mainModule.get("name"), "secondary": attachedModules} , "category":category.get("name") ,"projectTypeOfValue": PTOVName.get("name") ,"programmingLanguageSymbolType": PLSTName.get("name") }
                        
                        #Append to the different lists all the data we already have and need to be stored 
                        #Symbols
                        symbolsInfo.append(symbol)   
            except:
                pass
        
        #Close db cursor
        __symbolsDao.close()
          
        #Build response dictionary
        response= {"symbols": symbolsInfo, "modules": modulesInfo, "indexes": indexesIdList, "categories": categoryIdList}    

        return response

    @staticmethod
    def get_non_valid_symbols(symbolList):
        __symbolsDao = SymbolsDAO()
        #Initialize lists
        symbolsInfo = []
        modulesInfo = []
        
        for currentSymbol in symbolList:
            try:
                indexesNameList = []
                #Get symbol first
                #Table Symbol
                symbol = __symbolsDao.getSymbolByID(currentSymbol.get("id"))
                
                #if the symbol exists in the table
                if len(symbol) > 0:
                    #Check if it is validated
                    if(symbol.get('is_validated')==0):
                        #Retrieve referenced missing data 
                        
                        #Get main's module name the symbol is attached to
                        mainModule= __symbolsDao.getModuleName(symbol.get("Module_id"))
                        
                        #Get the secondary modules the symbol is in includes main module 
                        attachedModules = SymbolsService.get_secondary_modules(symbol.get("id"), mainModule.get("name"))        
                        
                        #Adding modules to the list of modules, has to be unique
                        if len(mainModule) > 0:
                            if mainModule.get("name") not in modulesInfo:
                                modulesInfo.append(mainModule.get("name"))
                        
                        #Adding modules to the list of modules, has to be unique
                        if len(attachedModules) > 0:
                            for attachedModule in attachedModules:
                                if attachedModule not in modulesInfo:
                                    modulesInfo.append(attachedModule)
                        
                        #Get the Category name
                        #It is already validated
                        category = __symbolsDao.getCategoryName(symbol.get("Category_id"))
                        
                        #Get the ProgrammingLanguageSymbolType and ProjectTypeOfValue                        
                        PTOVName = __symbolsDao.getProjectTypeOfValue(symbol.get("ProjectTypeOfValue_id"))
                        PLSTName = __symbolsDao.getProgrammingLanguageSymbolType(symbol.get("ProgrammingLanguageSymbolType_id"))

                        #Get index names
                        #Table Symbol_has_Index
                        #Already validated indexes
                        idIndexList= __symbolsDao.getSymbolHasIndex(symbol.get("id"))
                        
                        for idIndex in idIndexList:
                            #Only index name to fill symbol information
                            indexName= __symbolsDao.getIndexName(idIndex.get("Index_id"))

                            #Index name list for this symbol    
                            if indexName.get("index_name") not in indexesNameList:
                                indexesNameList.append(indexName.get("index_name"))
                        
                        if(symbol.get("is_indexed")==1):
                            is_indexed='True'
                        else:
                            is_indexed='False'
                        

                        #Build the symbol dictionary 
                        symbol = { "name": symbol.get("name"), "definition": symbol.get("definition"), "unit" : symbol.get("unit"), "indexes" : indexesNameList, "modules":{"main": mainModule.get("name"), "secondary": attachedModules} , "category":category.get("name") ,"projectTypeOfValue": PTOVName.get("name") ,"programmingLanguageSymbolType": PLSTName.get("name"), "is_indexed":is_indexed }
                        
                        #Append to the different lists all the data we already have and need to be stored 
                        #Symbols
                        symbolsInfo.append(symbol)   
            except:
                pass
        
        #Close db cursor
        __symbolsDao.close()
        
        response= {"symbols": symbolsInfo, "modules": modulesInfo}    

        return response

    @staticmethod
    def get_secondary_modules(symbolId, mainModule):
        __symbolsDao = SymbolsDAO()
        secondaryModulesInfo= []

        #Table Symbol_used_Module
        idModuleList = __symbolsDao.getSymbolUsedModule(symbolId)
        
        for idModule in idModuleList:
            #Table Module
            module = __symbolsDao.getModuleName(idModule.get("Module_id"))

            if module.get("name") not in secondaryModulesInfo:
                if module.get("name") != mainModule:
                    secondaryModulesInfo.append(module.get("name"))
        
        __symbolsDao.close()

        #Return a list of module names used by the symbol
        return secondaryModulesInfo

    #Method for users worker
    @rpc
    def get_module_name(self, ModuleID):
        __symbolsDao = SymbolsDAO()
        module=__symbolsDao.getModuleName(ModuleID)
        __symbolsDao.close()
        return module.get("name")

    #Method for users worker
    @rpc
    def get_module_id(self, moduleName):
        __symbolsDao = SymbolsDAO()
        moduleID=__symbolsDao.getModuleID(moduleName)
        __symbolsDao.close()
        return moduleID

    @staticmethod
    def get_indexes(indexIdList):
        __symbolsDao = SymbolsDAO()
        indexesInfo= []
        
        #indexIdList is a list of symbol ids
        for currentIndex in indexIdList:
            #Table IndexI
            #I supose that indexes asociated with symbols are already validated
            #Need to get its elements
            index = __symbolsDao.getIndex(currentIndex)
            
            #Get the id's of the elements asociated to it, can be an empty list
            indexElemID = __symbolsDao.getIndexHasElements(index.get("id"))

            indexElementList=[]

            #Get every index element
            for indexElem in indexElemID:
                indexElemName = __symbolsDao.getIndexElement(indexElem.get("IndexValue_id"))
                indexElementList.append(indexElemName.get("value_name"))
            
            #Build index dictionary
            index = {"name": index.get("index_name"), "definition": index.get("definition"), "elements": indexElementList}
            indexesInfo.append(index)
        
        #Close db conection
        __symbolsDao.close()
        return indexesInfo
    
    @staticmethod
    def get_categories(categoryIdList):
        __symbolsDao = SymbolsDAO()
        categoriesInfo= []
        categoriesAlreadyIn=[]
        supercategory={}
        category={}

        #categoryIdList is a list of category ids
        for currentCategory in categoryIdList:
            alreadyInList= False
            
            if currentCategory not in categoriesAlreadyIn:
                #Table Category
                category = __symbolsDao.getCategory(1)
                
                #Validated check category
                if category.get("is_validated") == 1:
                    
                    #Check if it has a super category, search for it in that case
                    if category.get("Super_Category_id") is None:
                        category={"name": category.get("name"), "level": category.get("level"), "super_category": "null"}
                    else:
                        
                        #Now we have to search for super category
                        supercategory = __symbolsDao.getCategory(category.get("Super_Category_id"))
                        
                        #Validated check super category
                        if supercategory.get("is_validated") == 1:
                            
                            if category.get("Super_Category_id") in categoryIdList:
                                alreadyInList = True
                            
                            #If it has not been added to the final list, do it now else pass
                            if alreadyInList == False:
                                
                                categoryIdList.append(category.get("Super_Category_id"))
                                
                                #Should always be none, but just in case
                                if supercategory.get("Super_Category_id") is None:
                                    supercategory={"name": supercategory.get("name"), "level": supercategory.get("level"), "super_category": "null"}
                                else:
                                    supercategory={"name": supercategory.get("name"), "level": supercategory.get("level"), "super_category": supercategory.get("Super_Category_id")}    
                                
                                #Register supercategory
                                categoriesInfo.append(supercategory)
                                categoriesAlreadyIn.append(category.get("Super_Category_id"))
                                         
                        #Build category with super category name
                        category={"name": category.get("name"), "level": category.get("level"), "super_category": supercategory.get("name")}
                    
                    #Register category         
                    categoriesInfo.append(category)
                    categoriesAlreadyIn.append(currentCategory)
                
        #Close db conection
        __symbolsDao.close()

        return categoriesInfo


    ##############################################################
    #################### Add methods #############################
    ##############################################################
    @rpc
    def add_symbols_information(self, contentList):
        __symbolsDao = SymbolsDAO()
        try:
            symbolList = contentList.get("symbols")
        except:
            symbolList = []

        try:
            indexList = contentList.get("indexes")
        except:
            indexList = []

        #CHECK IF MODULE EXISTS
        try:
            moduleID = __symbolsDao.getModuleID(contentList.get("module"))
        except:
            return "Module not Found"

        #SET THEM AS VALIDATED FALSE AND INDEXED TRUE IF THERE ARE INDEXES
        #ADD SYMBOLS
        for symbol in symbolList:     
            #Check if symbol already exists
            symbolExisted=__symbolsDao.getSymbolByName(symbol.get("name"))
            
            #Avoid spaces in names
            res = " " in symbol.get("name")
            if(res):
                symbolExisted=" "

            if symbolExisted is None:
                #Check if category already exists
                try:
                    categoryID = __symbolsDao.getCategoryID(symbol.get("Category"))
                except:
                    __symbolsDao.insertCategory(symbol.get("Category"), 1, 1, None)
                
                #Get ProgrammingLanguageSymbolType and ProyectTypeOfValue Ids so we pass them to the symbol adding process
                try:
                    PLSTId = __symbolsDao.getProgrammingLanguageSymbolTypeID(symbol.get("ProgrammingLanguageSymbolType")).get("id")
                    PTOVHasPLST = __symbolsDao.getProjectTypeOfValueHasProgrammingLanguageSymbolType(PLSTId)
                    PTOVId = PTOVHasPLST[0].get("ProjectTypeOfValue_id")   
                except:
                    return "ProgrammingLanguageSymbolType/ProjectTypeOfValue Error"
                    
                #Symbol adding
                try:
                    __symbolsDao.insertSymbol(symbol.get("name"),symbol.get("definition"),symbol.get("unit"),0,1,moduleID.get("id"),categoryID.get("id"), PTOVId, PLSTId)
                except:  
                    return "Symbol Insert Error"
            
        #ADD INDEXES    
        for index in indexList:
            try:
                #Check if it exists insert if not
                indexID = __symbolsDao.getIndexID(index.get("indexName"))
                
                #Avoid spaces in names
                res = " " in index.get("indexName")
                if(res):
                    symbolExisted=" "

                if indexID is None:
                    __symbolsDao.insertIndex(index.get("indexName"), 0, index.get("definition"))
                    indexID = __symbolsDao.getIndexID(index.get("indexName")) 
                
                SymbolsService.modify_index_elements(self, index.get("indexName"), index.get("indexElements"))


            except:
                return "Index Error"

        __symbolsDao.close()

        return "Success"

    @rpc
    def add_symbol_namedParams(self, name, definition, unit, is_validated, is_indexed, moduleName, categoryName, PTOVName, PLSTName):
        __symbolsDao = SymbolsDAO()
        
        categoryID=__symbolsDao.getCategoryID(categoryName)
        moduleID=__symbolsDao.getModuleID(moduleName)
        PTOVID=__symbolsDao.getProjectTypeOfValueID(PTOVName)
        PLSTID=__symbolsDao.getProgrammingLanguageSymbolTypeID(PLSTName)

        __symbolsDao.close()

        SymbolsService.add_symbol(name, definition, unit, is_validated, is_indexed, moduleID.get("id"), categoryID.get("id"), PTOVID.get("id"), PLSTID.get("id"))

    @staticmethod
    def add_symbol(name, definition, unit, is_validated, is_indexed, moduleID, categoryID, PTOVID, PLSTID):
        __symbolsDao = SymbolsDAO()
        try:
            symbol=__symbolsDao.getSymbolByName(name)
            if symbol is None:
                __symbolsDao.insertSymbol(name, definition, unit, is_validated, is_indexed, moduleID, categoryID, PTOVID, PLSTID)
        
        except:
            __symbolsDao.insertSymbol(name, definition, unit, is_validated, is_indexed, moduleID, categoryID, PTOVID, PLSTID)
        
        __symbolsDao.close()

    @rpc
    def add_index_namedParams(self, name, definition):
        __symbolsDao = SymbolsDAO()
        
        __symbolsDao.insertIndex(name, 0, definition)
        
        __symbolsDao.close()

    @rpc
    def add_module_namedParams(self, name):
        __symbolsDao = SymbolsDAO()
        
        __symbolsDao.insertModule(name)
        
        __symbolsDao.close()

    @rpc
    def add_category_namedParams(self, name, level, Super_Category_id):
        __symbolsDao = SymbolsDAO()
        
        __symbolsDao.insertCategory(name, level, 1, Super_Category_id)
        
        __symbolsDao.close()

    @rpc
    @staticmethod
    def add_category(name, level, is_validated, Super_Category_id):
        __symbolsDao = SymbolsDAO()
        __symbolsDao.insertCategory(name, level, is_validated, Super_Category_id)
        
        __symbolsDao.close()

    @rpc
    @staticmethod
    def add_index(index_name, is_validated, definition):
        __symbolsDao = SymbolsDAO()
        __symbolsDao.insertIndex(index_name, is_validated, definition)

        __symbolsDao.close()

    
    @rpc
    @staticmethod
    def add_indexElement(element_name):
        __symbolsDao = SymbolsDAO()
        __symbolsDao.insertIndexElement(element_name)
        
        __symbolsDao.close()

    ##############################################################
    ################### Modify methods ###########################
    ##############################################################
    @rpc
    def modify_symbol_namedParams(self, previousName, newName, definition, unit, is_validated, is_indexed, moduleName, categoryName, PTOVName, PLSTName):
        __symbolsDao = SymbolsDAO()

        categoryID=__symbolsDao.getCategoryID(categoryName)
        moduleID=__symbolsDao.getModuleID(moduleName)
        PTOVID=__symbolsDao.getProjectTypeOfValueID(PTOVName)
        PLSTID=__symbolsDao.getProgrammingLanguageSymbolTypeID(PLSTName)

        __symbolsDao.close()

        SymbolsService.modify_symbol(previousName, newName, definition, unit, is_validated, is_indexed, moduleID.get("id"), categoryID.get("id"), PTOVID.get("id"), PLSTID.get("id"))

    @staticmethod
    def modify_symbol(previousName, newName, definition, unit, is_validated, is_indexed, moduleID, categoryID, PTOVID, PLSTID):
        __symbolsDao = SymbolsDAO()
        
        previousSymbol= __symbolsDao.getSymbolByName(previousName)
        if(moduleID != previousSymbol.get("Module_id")):
            
            __symbolsDao.deleteSymbolModuleUse(previousSymbol.get("id"), previousSymbol.get("Module_id"))

            associatedModules= __symbolsDao.getSymbolUsedModule(previousSymbol.get("id"))
            secondary=False

            for module in associatedModules:
                if(module.get("Module_id")==moduleID):
                    secondary=True

            if(secondary==False):
                __symbolsDao.insertSymbolUsedModule(previousSymbol.get("id"), moduleID)
        

        __symbolsDao.updateSymbol(previousName, newName, definition, unit, is_validated, is_indexed, moduleID, categoryID, PTOVID, PLSTID)
        
        __symbolsDao.close()

    @rpc
    def modify_index_namedParams(self, previousName, newName, definition):
        __symbolsDao = SymbolsDAO()

        __symbolsDao.updateIndex(previousName, newName, definition, 0)

        indexID =__symbolsDao.getIndexID(newName).get("id")
         
        symbolsAssociated= __symbolsDao.getIndexHasSymbol(indexID)
        for symbol in symbolsAssociated:
            __symbolsDao.updateSymbolIsIndexed(0, 1, symbol.get("Symbol_id"))
        
        __symbolsDao.close()

    @rpc
    def modify_module_namedParams(self, previousName, newName):
        __symbolsDao = SymbolsDAO()

        __symbolsDao.updateModule(previousName, newName)

        __symbolsDao.close()

    @rpc
    def modify_category_namedParams(self, previousName, newName):
        __symbolsDao = SymbolsDAO()

        __symbolsDao.updateCategory(previousName, newName)

        __symbolsDao.close()

    @rpc
    def modify_promote_category_namedParams(self, name):
        __symbolsDao = SymbolsDAO()

        __symbolsDao.updatePromoteCategory(name)

        __symbolsDao.close()

    @rpc
    def modify_symbol_modules(self, symbolName, mainModule, secondaryModule):
        __symbolsDao = SymbolsDAO()
        
        symbol= __symbolsDao.getSymbolByName(symbolName)

        #Delete the current asociated modules
        __symbolsDao.deleteSymbolUsedModule(symbol.get("id"))
        
        #Add the main module and associate it's id to the symbol
        
        mainModuleID = __symbolsDao.getModuleID(mainModule)
        __symbolsDao.insertSymbolUsedModule(symbol.get("id"), mainModuleID.get("id"))
        __symbolsDao.updateSymbolMainModule(0, mainModuleID.get("id"), symbol.get("id"))
        
        #Add the secondary modules
        for secondary in secondaryModule:

            __symbolsDao.insertSymbolUsedModule(symbol.get("id"), __symbolsDao.getModuleID(secondary).get("id"))
        
        __symbolsDao.close()

    @rpc
    def modify_symbol_indexes(self, symbolName, is_indexed, indexes):
        __symbolsDao = SymbolsDAO()
        
        symbol= __symbolsDao.getSymbolByName(symbolName)

        #Delete the current asociated indexes
        __symbolsDao.deleteSymbolHasIndexes(symbol.get("id"))
        
        #Change the symbol's is_indexed value
        __symbolsDao.updateSymbolIsIndexed(0, is_indexed, symbol.get("id"))
        
        #Add the secondary modules
        for index in indexes:
            __symbolsDao.insertSymbolHasIndex(symbol.get("id"), __symbolsDao.getIndexID(index).get("id"))

        __symbolsDao.close()
    
    @rpc
    def modify_index_elements(self, name, elements):
        __symbolsDao = SymbolsDAO()
        
        indexID = __symbolsDao.getIndexID(name).get("id")
        
        previousIndexElements = __symbolsDao.getIndexHasElements(indexID)
        #Delete previously associated elements to the index
        if len(previousIndexElements) > 0:
            for indexElement in previousIndexElements:
                __symbolsDao.deleteIndexHasIndexElement_IV_id(indexElement.get("IndexValue_id"))
                __symbolsDao.deleteIndexElement(indexElement.get("IndexValue_id"))

        #Check if there are more elements with the same name and assigns the value to the one without links
        for element in elements:
            __symbolsDao.insertIndexElement(element)
            sameElementsIDList=__symbolsDao.getIndexElementsNameID(element)
            #Link one index element only that has no current links to an index
            unlinked=True
            for sameElementID in sameElementsIDList:
                if(len(__symbolsDao.getIndexElementHasIndexes(sameElementID.get("id")))==0 and unlinked):
                    __symbolsDao.insertIndexHasIndexElement(indexID, sameElementID.get("id"))
                    unlinked=False

        #Set index to non_validated 
        __symbolsDao.updateIndexElem(indexID, 0)

        #Sets symbols associated to non_validated
        symbolsAssociated= __symbolsDao.getIndexHasSymbol(indexID)
        for symbol in symbolsAssociated:
            __symbolsDao.updateSymbolIsIndexed(0, 1, symbol.get("Symbol_id"))

        __symbolsDao.close()


    ##############################################################
    ################## Delete methods ############################
    ##############################################################
    @rpc
    def delete_symbol(self, name):
        __symbolsDao = SymbolsDAO()
          
        __symbolsDao.deleteSymbol(name)
        
        __symbolsDao.close()

    @rpc
    def delete_index(self, name):
        __symbolsDao = SymbolsDAO()

        indexID =__symbolsDao.getIndexID(name).get("id")
        
        indexElements = __symbolsDao.getIndexHasElements(indexID)

        if len(indexElements) > 0:
            for indexElement in indexElements:
                __symbolsDao.deleteIndexElement(indexElement.get("IndexValue_id"))

        __symbolsDao.deleteIndex(name)
        
        __symbolsDao.close()

    @rpc
    def delete_module(self, name):
        __symbolsDao = SymbolsDAO()

        moduleID =__symbolsDao.getModuleID(name).get("id")
        
        __symbolsDao.deleteModule(moduleID)
        
        __symbolsDao.close()

    @rpc
    def delete_category(self, name):
        __symbolsDao = SymbolsDAO()

        categoryID =__symbolsDao.getCategoryID(name).get("id")
        
        __symbolsDao.deleteCategory(categoryID)
        
        __symbolsDao.close()


    ##############################################################
    ################### Check methods ############################
    ##############################################################
    @rpc
    def exists_symbol(self, name):
        __symbolsDao = SymbolsDAO()
        
        symbol=__symbolsDao.getSymbolByName(name)
        
        __symbolsDao.close()
        
        if symbol is None:
            return True

        return False
    
    @rpc
    def exists_index(self, name):
        __symbolsDao = SymbolsDAO()
        
        index=__symbolsDao.getIndexID(name)
        
        __symbolsDao.close()
        
        if index is None:
            return True

        return False

    @rpc
    def exists_module(self, name):
        __symbolsDao = SymbolsDAO()
        
        module =__symbolsDao.getModuleID(name)
        
        __symbolsDao.close()
        
        if module is None:
            return True

        return False

    @rpc
    def exists_category(self, name):
        __symbolsDao = SymbolsDAO()
        
        category =__symbolsDao.getCategoryID(name)
        
        __symbolsDao.close()
        
        if category is None:
            return True

        return False
    
    @rpc
    def has_index_indexElements(self, name):
        __symbolsDao = SymbolsDAO()
        
        indexElements=[]

        indexID =__symbolsDao.getIndexID(name).get("id")
        
        indexElements = __symbolsDao.getIndexHasElements(indexID)

        __symbolsDao.close()
        
        if len(indexElements) == 0:
            return True

        return False

    @rpc
    def has_module_symbols(self, name):
        __symbolsDao = SymbolsDAO()
        
        associatedSymbols=[]

        moduleID =__symbolsDao.getModuleID(name).get("id")
        
        associatedSymbols = __symbolsDao.getModuleSymbolsID(moduleID)

        __symbolsDao.close()
        
        if len(associatedSymbols) == 0:
            return True

        return False

    @rpc
    def has_category_symbols(self, name):
        __symbolsDao = SymbolsDAO()
        
        associatedSymbols=[]

        categoryID =__symbolsDao.getCategoryID(name).get("id")
        
        associatedSymbols = __symbolsDao.getCategorySymbolsID(categoryID)

        __symbolsDao.close()
        
        if len(associatedSymbols) == 0:
            return True

        return False

    @rpc
    def is_symbol_indexed(self, name):
        __symbolsDao = SymbolsDAO()
          
        symbol=__symbolsDao.getSymbolByName(name)
        
        __symbolsDao.close()

        return symbol.get("is_indexed")

    ##############################################################
    ################# Validate methods ###########################
    ##############################################################
    @rpc
    def validate_symbol(self, name):
        __symbolsDao = SymbolsDAO()
          
        __symbolsDao.validateSymbolByName(name)
        
        __symbolsDao.close()

    @rpc
    def validate_index(self, name):
        __symbolsDao = SymbolsDAO()
          
        indexID =__symbolsDao.getIndexID(name).get("id")
          
        __symbolsDao.validateIndex(indexID)
        
        __symbolsDao.close()


    ##############################################################
    ################### Search methods ###########################
    ##############################################################

    @rpc
    def search_text(self, source, text, mode):
        __symbolsDao = SymbolsDAO()
        searchedData=None
        if(source=="modules"):
            #Get searched modules from DB
            if(mode=="exact"):
                moduleList=__symbolsDao.searchExactModules(text)    
            else:
                moduleList=__symbolsDao.searchModules('%'+text+'%')
            searchedData= SymbolsService.get_search_modules(moduleList)
        elif(source=="categories"):
            #Get searched categories from DB
            if(mode=="exact"):
                categoryList=__symbolsDao.searchExactCategories(text)
            else:
                categoryList=__symbolsDao.searchCategories('%'+text+'%')
            searchedData=SymbolsService.get_search_categories(categoryList)
        elif(source=="indexes"): 
            #Get searched indexes from DB
            if(mode=="exact"):
                indexList=__symbolsDao.searchExactIndexes(text)
            else:
                indexList=__symbolsDao.searchIndexes('%'+text+'%')
            searchedData=SymbolsService.get_search_indexes(indexList)
        else:
            #Get searched symbols from DB
            if(mode=="exact"):
                symbolList=__symbolsDao.searchExactSymbols(text)        
            else:
                symbolList=__symbolsDao.searchSymbols('%'+text+'%')
            searchedData=SymbolsService.get_search_symbols(symbolList)

        __symbolsDao.close()
        return searchedData


    @staticmethod
    def get_search_modules(moduleList):
        __symbolsDao = SymbolsDAO()
        moduleInfo=[]

        #Get all symbols from DB
        for module in moduleList:
            moduleID = __symbolsDao.getModuleID(module.get("name"))
            symbolCount = __symbolsDao.getModuleSymbolsCount(moduleID.get("id"))
            moduleInfo.append({"module_name": module.get("name"), "symbols": symbolCount.get("COUNT(*)")})
        
        __symbolsDao.close()
        return moduleInfo


    @staticmethod
    def get_search_indexes(indexList):
        indexListValidated=[] 
        indexListNonValidated=[]
        for index in indexList:
            if(index.get("is_validated")==1):
                indexListValidated.append(index)
            else:
                indexListNonValidated.append(index)
        
        validatedIndexes=SymbolsService.get_format_indexes(indexListValidated)
        nonvalidatedIndexes=SymbolsService.get_format_indexes(indexListNonValidated)
        
        data={"validated": validatedIndexes,"non_validated": nonvalidatedIndexes }
        
        return data

    @staticmethod
    def get_format_indexes(indexesList):
        __symbolsDao = SymbolsDAO()
        indexList=[]
        for index in indexesList:
            
            indexElemID = __symbolsDao.getIndexHasElements(index.get("id"))

            indexElementList=[]
            #Get every index element
            for indexElem in indexElemID:
                indexElemName = __symbolsDao.getIndexElement(indexElem.get("IndexValue_id"))
                indexElementList.append(indexElemName.get("value_name"))
                    
            indexSymbols= __symbolsDao.getIndexHasSymbol(index.get("id"))
            indexSymbolsList=[]

            for symbol in indexSymbols:
                symbolName = __symbolsDao.getSymbolByID(symbol.get("Symbol_id"))    
                indexSymbolsList.append(symbolName.get("name"))  

            indexList.append({"index_name": index.get("index_name"), "definition": index.get("definition"), "symbols": indexSymbolsList, "elements": indexElementList})
                    
        __symbolsDao.close()
        return indexList


    @staticmethod
    def get_search_symbols(symbolList):
        __symbolsDao = SymbolsDAO()
        symbolListValid=[]
        symbolListNoNValid=[]
        
        for symbol in symbolList:
            if(symbol.get("is_validated")==1):
                symbolListValid.append(symbol)
            else:
                symbolListNoNValid.append(symbol)
       

        #Only get the information of the validated ones
        validSymbols = SymbolsService.get_format_symbols(symbolListValid)

        #Get the information of the non validated
        nonValidSymbols = SymbolsService.get_format_symbols(symbolListNoNValid)

        #Build response
        response= {"validated": validSymbols.get("symbols"), "non_validated": nonValidSymbols.get("symbols")}
        
        return response

    @staticmethod
    def get_format_symbols(symbolList):
        __symbolsDao = SymbolsDAO()
        #Initialize lists
        symbolsInfo = []
        modulesInfo = []
        
        for currentSymbol in symbolList:
            try:
                indexesNameList = []
                #Get symbol first
                #Table Symbol
                symbol = __symbolsDao.getSymbolByID(currentSymbol.get("id"))
                
                #if the symbol exists in the table
                if len(symbol) > 0:
                    #Retrieve referenced missing data 
                        
                    #Get main's module name the symbol is attached to
                    mainModule= __symbolsDao.getModuleName(symbol.get("Module_id"))
                        
                    #Get the secondary modules the symbol is in includes main module 
                    attachedModules = SymbolsService.get_secondary_modules(symbol.get("id"), mainModule.get("name"))        
                        
                    #Adding modules to the list of modules, has to be unique
                    if len(mainModule) > 0:
                        if mainModule.get("name") not in modulesInfo:
                            modulesInfo.append(mainModule.get("name"))
                        
                    #Adding modules to the list of modules, has to be unique
                    if len(attachedModules) > 0:
                        for attachedModule in attachedModules:
                            if attachedModule not in modulesInfo:
                                modulesInfo.append(attachedModule)
                        
                    #Get the Category name
                    #It is already validated
                    category = __symbolsDao.getCategoryName(symbol.get("Category_id"))
                        
                    #Get the ProgrammingLanguageSymbolType and ProjectTypeOfValue                        
                    PTOVName = __symbolsDao.getProjectTypeOfValue(symbol.get("ProjectTypeOfValue_id"))
                    PLSTName = __symbolsDao.getProgrammingLanguageSymbolType(symbol.get("ProgrammingLanguageSymbolType_id"))

                    #Get index names
                    #Table Symbol_has_Index
                    #Already validated indexes
                    idIndexList= __symbolsDao.getSymbolHasIndex(symbol.get("id"))
                        
                    for idIndex in idIndexList:
                        #Only index name to fill symbol information
                        indexName= __symbolsDao.getIndexName(idIndex.get("Index_id"))

                        #Index name list for this symbol    
                        if indexName.get("index_name") not in indexesNameList:
                            indexesNameList.append(indexName.get("index_name"))
                        
                    if(symbol.get("is_indexed")==1):
                        is_indexed='True'
                    else:
                        is_indexed='False'
                        

                    #Build the symbol dictionary 
                    symbol = { "name": symbol.get("name"), "definition": symbol.get("definition"), "unit" : symbol.get("unit"), "indexes" : indexesNameList, "modules":{"main": mainModule.get("name"), "secondary": attachedModules} , "category":category.get("name") ,"projectTypeOfValue": PTOVName.get("name") ,"programmingLanguageSymbolType": PLSTName.get("name"), "is_indexed":is_indexed }
                        
                    #Append to the different lists all the data we already have and need to be stored 
                    #Symbols
                    symbolsInfo.append(symbol)   
            except:
                pass
        
        #Close db cursor
        __symbolsDao.close()
        
        response= {"symbols": symbolsInfo, "modules": modulesInfo}    

        return response


    @staticmethod
    def get_search_categories(categoryList):
        __symbolsDao = SymbolsDAO()
        superCategoryList=[]
        superCategoryNameList=[]
        subCategoryList=[]

        for category in categoryList:
            if(category.get("level")==1):
                superCategoryList.append(category)
                superCategoryNameList.append(category.get("name"))
            else:
                subCategoryList.append(category)
       
        for subcategory in subCategoryList:
            subCatSuperCat=__symbolsDao.getCategory(subcategory.get("Super_Category_id"))
            try:
                superCategoryNameList.index(subCatSuperCat.get("name"))
            except:
                superCategoryList.append(subCatSuperCat)
                superCategoryNameList.append(subCatSuperCat.get("name"))
                
        #Get the information of the super-categories
        response = SymbolsService.get_format_categories(superCategoryList)
        
        __symbolsDao.close()

        return response

    @staticmethod
    def get_format_categories(superCategoryList):
        __symbolsDao = SymbolsDAO()
        categoryInfo=[]

        for category in superCategoryList:
            superCategoryID = __symbolsDao.getCategoryID(category.get("name"))
            superSymbolCount = __symbolsDao.getCategorySymbolsCount(superCategoryID.get("id"))

            subCategoryList=[]

            subcategories = __symbolsDao.getAllSubCategories(superCategoryID.get("id"))
            for subcategory in subcategories:
                subCategoryID = __symbolsDao.getCategoryID(subcategory.get("name"))
                subSymbolCount = __symbolsDao.getCategorySymbolsCount(subCategoryID.get("id"))

                subCategoryList.append({"category_name": subcategory.get("name"), "symbols_count": subSymbolCount.get("COUNT(*)")})
                
            categoryInfo.append({"category_name": category.get("name"), "subcategories_count": len(subcategories), "symbols_count": superSymbolCount.get("COUNT(*)"), "subcategories": subCategoryList})
        
        return categoryInfo

