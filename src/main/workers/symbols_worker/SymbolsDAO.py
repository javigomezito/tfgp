from DbHelp.DbHelper import DbHelper


class SymbolsDAO(object):
   __db = None

   def __init__(self):
      self.__db = DbHelper()
    
   def close(self):
      self.__db.close()


   ################# GETS #################
   def getAllSymbols(self):
      return self.__db.query("SELECT id FROM Symbol", None).fetchall()

   def getSymbolByName(self, name):
      return self.__db.query("SELECT * FROM Symbol WHERE Symbol.name = %s", name).fetchone()

   def getSymbolByID(self, id):
      return self.__db.query("SELECT * FROM Symbol WHERE Symbol.id = %s", id).fetchone()

   def getSymbolIs_Indexed(self, name):
      return self.__db.query("SELECT is_indexed FROM Symbol WHERE Symbol.name = %s", name).fetchone()

   def getCategorySymbolsCount(self, categoryID):
      return self.__db.query("SELECT COUNT(*) FROM Symbol WHERE Category_id= %s", categoryID).fetchone()


   def getAllModulesName(self):
      return self.__db.query("SELECT name FROM Module WHERE Module.id > 1", None).fetchall()

   def getModuleName(self, moduleId):
      return self.__db.query("SELECT name FROM Module WHERE Module.id = %s", moduleId).fetchone()
   
   def getModuleID(self, moduleName):
      return self.__db.query("SELECT id FROM Module WHERE Module.name = %s", moduleName).fetchone()

   def getModuleSymbolsCount(self, moduleID):
      return self.__db.query("SELECT COUNT(*) FROM Symbol_used_Module WHERE Module_id= %s", moduleID).fetchone()

   def getMainModuleSymbolsCount(self, moduleID):
      return self.__db.query("SELECT COUNT(*) FROM Symbol WHERE Module_id= %s", moduleID).fetchone()

   def getModuleSymbolsID(self, moduleID):
      return self.__db.query("SELECT Symbol_id FROM Symbol_used_Module WHERE Module_id= %s", moduleID).fetchall()

   def getCategorySymbolsID(self, categoryID):
      return self.__db.query("SELECT id FROM Symbol WHERE Category_id= %s", categoryID).fetchall()


   def getCategoryID(self, categoryName):
      return self.__db.query("SELECT id FROM Category WHERE Category.name = %s", categoryName).fetchone()

   def getCategoryName(self, categoryId):
      return self.__db.query("SELECT name FROM Category WHERE Category.id = %s", categoryId).fetchone()

   def getAllCategories(self):
      return self.__db.query("SELECT name, level, is_validated, Super_Category_id FROM Category", None).fetchall()

   def getAllSuperCategories(self):
      return self.__db.query("SELECT name, is_validated, Super_Category_id FROM Category WHERE Category.level = 1", None).fetchall()

   def getAllSubCategories(self, Super_Category_id):
      return self.__db.query("SELECT name, is_validated, Super_Category_id FROM Category WHERE Category.Super_Category_id = %s", Super_Category_id).fetchall()

   def getCategory(self, categoryId):
      return self.__db.query("SELECT name, level, is_validated, Super_Category_id FROM Category WHERE Category.id = %s", categoryId).fetchone()


   def getAllProjectTypeOfValues(self):
      return self.__db.query("SELECT name FROM ProjectTypeOfValue", None).fetchall()

   def getProjectTypeOfValue(self, PTOVId):
      return self.__db.query("SELECT name FROM ProjectTypeOfValue WHERE ProjectTypeOfValue.id = %s", PTOVId).fetchone()

   def getProjectTypeOfValueID(self, PTOVName):
      return self.__db.query("SELECT id FROM ProjectTypeOfValue WHERE ProjectTypeOfValue.name = %s", PTOVName).fetchone()

   def getProjectTypeOfValueHasProgrammingLanguageSymbolType(self, PLSTid):
      return self.__db.query("SELECT ProjectTypeOfValue_id FROM ProjectTypeOfValue_has_ProgrammingLanguageSymbolType WHERE ProjectTypeOfValue_has_ProgrammingLanguageSymbolType.ProgrammingLanguageSymbolType_id = %s", PLSTid).fetchall()

   def getAllProgrammingLanguageSymbolTypes(self):
      return self.__db.query("SELECT name FROM ProgrammingLanguageSymbolType", None).fetchall()

   def getProgrammingLanguageSymbolType(self, PLSTId):
      return self.__db.query("SELECT name FROM ProgrammingLanguageSymbolType WHERE ProgrammingLanguageSymbolType.id = %s", PLSTId).fetchone()

   def getProgrammingLanguageSymbolTypeID(self, PLSTName):
      return self.__db.query("SELECT id FROM ProgrammingLanguageSymbolType WHERE ProgrammingLanguageSymbolType.name = %s", PLSTName).fetchone()

   def getAllIndexesValidated(self):
      return self.__db.query("SELECT id, index_name, definition FROM IndexI WHERE is_validated=1", None).fetchall()

   def getAllIndexesNonValidated(self):
      return self.__db.query("SELECT id, index_name, definition FROM IndexI WHERE is_validated=0", None).fetchall()

   def getSymbolHasIndex(self, symbolId):
      return self.__db.query("SELECT Index_id FROM Symbol_has_Index WHERE Symbol_has_Index.Symbol_id = %s", symbolId).fetchall()

   def getIndexHasSymbol(self, indexID):
      return self.__db.query("SELECT Symbol_id FROM Symbol_has_Index WHERE Symbol_has_Index.Index_id = %s", indexID).fetchall()

   def getIndex(self, indexId):
      return self.__db.query("SELECT id, index_name, definition FROM IndexI WHERE IndexI.id = %s", indexId).fetchone()

   def getIndexID(self, indexName):
      return self.__db.query("SELECT id FROM IndexI WHERE IndexI.index_name = %s", indexName).fetchone()

   def getIndexName(self, indexId):
      return self.__db.query("SELECT index_name FROM IndexI WHERE IndexI.id = %s", indexId).fetchone()

   def getIndexHasElements(self, indexId):
      return self.__db.query("SELECT IndexValue_id FROM Index_has_IndexValue WHERE Index_has_IndexValue.Index_id = %s", indexId).fetchall()

   def getIndexElementHasIndexes(self, indexElemId):
      return self.__db.query("SELECT Index_id FROM Index_has_IndexValue WHERE Index_has_IndexValue.IndexValue_id = %s", indexElemId).fetchall()

   def getIndexElement(self, indexElementId):
      return self.__db.query("SELECT value_name FROM IndexValue WHERE IndexValue.id = %s", indexElementId).fetchone()

   def getIndexElementsNameID(self, indexElementName):
      return self.__db.query("SELECT id FROM IndexValue WHERE IndexValue.value_name = %s", indexElementName).fetchall()

   #def getIndexElementID(self, indexElementName):
   #   return self.__db.query("SELECT id FROM IndexValue WHERE IndexValue.value_name = %s", indexElementName).fetchone()

   def getSymbolUsedModule(self, symbolId):
      return self.__db.query("SELECT Module_id FROM Symbol_used_Module WHERE Symbol_used_Module.Symbol_id = %s", symbolId).fetchall()


   ################# INSERTS #################
   def insertSymbol(self, name, definition, unit, is_validated, is_indexed, Module_id, Category_id, ProjectTypeOfValue_id, ProgrammingLanguageSymbolType_id):
      return self.__db.query("INSERT INTO Symbol (name, definition, unit, is_validated, is_indexed, Module_id, Category_id, ProjectTypeOfValue_id, ProgrammingLanguageSymbolType_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (name, definition, unit, is_validated, is_indexed, Module_id, Category_id, ProjectTypeOfValue_id, ProgrammingLanguageSymbolType_id))

   def insertIndex(self, index_name, is_validated, definition):
      return self.__db.query("INSERT INTO IndexI (index_name, is_validated, definition) VALUES (%s, %s, %s)", (index_name, is_validated, definition))
 
   def insertIndexElement(self, element_name):
      return self.__db.query("INSERT INTO IndexValue (value_name) VALUES (%s)", (element_name))
         
   def insertIndexHasIndexElement(self, indexID, indexElemID):
      return self.__db.query("INSERT INTO Index_has_IndexValue (Index_id, IndexValue_id) VALUES (%s, %s)", (indexID, indexElemID))

   def insertCategory(self, name, level, is_validated, Super_Category_id):
      return self.__db.query("INSERT INTO Category (name, level, is_validated, Super_Category_id) VALUES (%s, %s, %s, %s)", (name, level, is_validated, Super_Category_id))

   def insertSymbolUsedModule(self, Symbol_id, Module_id):
      return self.__db.query("INSERT INTO Symbol_used_Module (Symbol_id, Module_id) VALUES (%s, %s)", (Symbol_id, Module_id))

   def insertSymbolHasIndex(self, Symbol_id, Index_id):
      return self.__db.query("INSERT INTO Symbol_has_Index (Symbol_id, Index_id) VALUES (%s, %s)", (Symbol_id, Index_id))

   def insertModule(self, name):
      return self.__db.query("INSERT INTO Module (name) VALUES (%s)", (name))
 

   ################# UPDATES #################
   def updateSymbol(self, previousName, newName, definition, unit, is_validated, is_indexed, Module_id, Category_id, ProjectTypeOfValue_id, ProgrammingLanguageSymbolType_id):
      return self.__db.query("UPDATE Symbol SET name= %s, definition= %s, unit= %s, is_validated= %s, is_indexed= %s, Module_id= %s, Category_id= %s, ProjectTypeOfValue_id= %s, ProgrammingLanguageSymbolType_id= %s WHERE name = %s", (newName, definition, unit, is_validated, is_indexed, Module_id, Category_id, ProjectTypeOfValue_id, ProgrammingLanguageSymbolType_id, previousName))
   
   def updateSymbolMainModule(self, is_validated, Module_id, id):
      return self.__db.query("UPDATE Symbol SET is_validated= %s, Module_id= %s WHERE id = %s", (is_validated, Module_id, id))
   
   def updateSymbolIsIndexed(self, is_validated, is_indexed, id):
      return self.__db.query("UPDATE Symbol SET is_validated= %s, is_indexed= %s WHERE id = %s", (is_validated, is_indexed, id))
   
   def validateSymbolByName(self, name):
      return self.__db.query("UPDATE Symbol SET is_validated= 1 WHERE name = %s", (name))

   def validateIndex(self, id):
      return self.__db.query("UPDATE IndexI SET is_validated= 1 WHERE id = %s", (id))

   def updateIndex(self, previousName, newName, definition, is_validated):
      return self.__db.query("UPDATE IndexI SET index_name= %s, definition= %s, is_validated=%s WHERE index_name = %s", (newName, definition, is_validated, previousName))
   
   def updateIndexElem(self, id, is_validated):
      return self.__db.query("UPDATE IndexI SET is_validated=%s WHERE id = %s", (is_validated, id))
   
   def updateModule(self, previousName, newName):
      return self.__db.query("UPDATE Module SET name= %s WHERE name = %s", (newName, previousName))
   
   def updateCategory(self, previousName, newName):
      return self.__db.query("UPDATE Category SET name= %s WHERE name = %s", (newName, previousName))
   
   def updatePromoteCategory(self, name):
      return self.__db.query("UPDATE Category SET level=1, Super_Category_id=Null  WHERE name = %s", (name))
   

   ################# DELETES #################
   def deleteSymbol(self, name):
      return self.__db.query("DELETE FROM Symbol WHERE name= %s", (name))

   def deleteSymbolUsedModule(self, Symbol_id):
      return self.__db.query("DELETE FROM Symbol_used_Module WHERE Symbol_id=%s", (Symbol_id))

   def deleteSymbolModuleUse(self, Symbol_id, Module_id):
      return self.__db.query("DELETE FROM Symbol_used_Module WHERE Symbol_id=%s AND Module_id=%s", (Symbol_id, Module_id))

   def deleteSymbolHasIndexes(self, Symbol_id):
      return self.__db.query("DELETE FROM Symbol_has_Index WHERE Symbol_id=%s", (Symbol_id))

   def deleteIndex(self, name):
      return self.__db.query("DELETE FROM IndexI WHERE index_name= %s", (name))

   def deleteIndexElement(self, id):
      return self.__db.query("DELETE FROM IndexValue WHERE id= %s", (id))

   def deleteIndexHasIndexElement_I_id(self, id):
      return self.__db.query("DELETE FROM Index_has_IndexValue WHERE Index_id= %s", (id))

   def deleteIndexHasIndexElement_IV_id(self, id):
      return self.__db.query("DELETE FROM Index_has_IndexValue WHERE IndexValue_id= %s", (id))

   def deleteModule(self, id):
      return self.__db.query("DELETE FROM Module WHERE id= %s", (id))

   def deleteCategory(self, id):
      return self.__db.query("DELETE FROM Category WHERE id= %s", (id))


   ################# Search #################
   def searchModules(self, text):
      return self.__db.query("SELECT name FROM Module WHERE Module.id > 1 AND Module.name LIKE %s", (text))

   def searchExactModules(self, text):
      return self.__db.query("SELECT name FROM Module WHERE Module.id > 1 AND Module.name= %s", (text))
      
   def searchSymbols(self, text):
      return self.__db.query("SELECT * FROM Symbol WHERE Symbol.name LIKE %s", (text))

   def searchExactSymbols(self, text):
      return self.__db.query("SELECT * FROM Symbol WHERE Symbol.name= %s", (text))

   def searchIndexes(self, text):
      return self.__db.query("SELECT id, index_name, definition, is_validated FROM IndexI WHERE IndexI.index_name LIKE %s", (text))

   def searchExactIndexes(self, text):
      return self.__db.query("SELECT id, index_name, definition, is_validated FROM IndexI WHERE IndexI.index_name= %s", (text))

   def searchCategories(self, text):
      return self.__db.query("SELECT name, level, is_validated, Super_Category_id FROM Category WHERE Category.name LIKE %s", text)

   def searchExactCategories(self, text):
      return self.__db.query("SELECT name, level, is_validated, Super_Category_id FROM Category WHERE Category.name= %s", (text))
