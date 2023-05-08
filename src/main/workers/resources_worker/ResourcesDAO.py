from DbHelp.DbHelper import DbHelper


class ResourcesDAO(object):
   __db = None

   def __init__(self):
      self.__db = DbHelper()
    
   def close(self):
      self.__db.close()

   def getAllAcronyms(self):
      return self.__db.query("SELECT letters, meaning FROM Acronym", None).fetchall()
   
   def getAllAdjectives(self):
      return self.__db.query("SELECT adjective, usages FROM Adjective", None).fetchall()
   
   def getAllSemanticRules(self):
      return self.__db.query("SELECT ruleforShort, explanation FROM SemancticRule", None).fetchall()
   
   def getAcronym(self, id):
      return self.__db.query("SELECT letters, meaning FROM Acronym WHERE Acronym.id=%s", (id)).fetchone()
   
   def getAdjective(self, id):
      return self.__db.query("SELECT adjective, usages FROM Adjective WHERE Adjective.id=%s", (id)).fetchone()
   
   def getSemanticRule(self, id):
      return self.__db.query("SELECT ruleforShort, explanation FROM SemancticRule WHERE SemancticRule.id=%s", (id)).fetchone()
   
   def getAcronymID(self, letters):
      return self.__db.query("SELECT id FROM Acronym WHERE Acronym.letters=%s", (letters)).fetchone()
   
   def getAdjectiveID(self, adjective):
      return self.__db.query("SELECT id FROM Adjective WHERE Adjective.adjective=%s", (adjective)).fetchone()
   
   def getSemanticRuleID(self, ruleforShort):
      return self.__db.query("SELECT id FROM SemancticRule WHERE SemancticRule.ruleforShort=%s", (ruleforShort)).fetchone()
   


   ########### Add methods ###########

   def insertAcronym(self, letters, meaning):
      return self.__db.query("INSERT INTO Acronym (letters, meaning) VALUES (%s, %s)", (letters, meaning))
   
   def insertAdjective(self, adjective, usages):
      return self.__db.query("INSERT INTO Adjective (adjective, usages) VALUES (%s, %s)", (adjective, usages))
   
   def insertSemanticRule(self, ruleforShort, explanation):
      return self.__db.query("INSERT INTO SemancticRule (ruleforShort, explanation) VALUES (%s, %s)", (ruleforShort, explanation))
   

   ########### Update methods ###########

   def updateAcronym(self, id, letters, meaning):
      return self.__db.query("UPDATE Acronym SET letters=%s, meaning=%s WHERE Acronym.id=%s", (letters, meaning, id))
   
   def updateAdjective(self, id, adjective, usages):
      return self.__db.query("UPDATE Adjective SET adjective=%s, usages=%s WHERE Adjective.id=%s", (adjective, usages, id))
   
   def updateSemanticRule(self, id, ruleforShort, explanation):
      return self.__db.query("UPDATE SemancticRule SET ruleforShort=%s, explanation=%s WHERE SemancticRule.id=%s", (ruleforShort, explanation, id))
   

   ########### Delete methods ###########

   def deleteAcronym(self, id):
      return self.__db.query("DELETE FROM Acronym WHERE id= %s", (id))
   
   def deleteAdjective(self, id):
      return self.__db.query("DELETE FROM Adjective WHERE id= %s", (id))
   
   def deleteSemanticRule(self, id):
      return self.__db.query("DELETE FROM SemancticRule WHERE id= %s", (id))
   



   ################# Search #################
   def searchAcronyms(self, text):
      return self.__db.query("SELECT letters, meaning FROM Acronym WHERE Acronym.letters LIKE %s", (text))

   def searchExactAcronyms(self, text):
      return self.__db.query("SELECT letters, meaning FROM Acronym WHERE Acronym.letters= %s", (text))
   
   def searchAdjectives(self, text):
      return self.__db.query("SELECT adjective, usages FROM Adjective WHERE Adjective.adjective LIKE %s", (text))

   def searchExactAdjectives(self, text):
      return self.__db.query("SELECT adjective, usages FROM Adjective WHERE Adjective.adjective= %s", (text))

   def searchSemanticRules(self, text):
      return self.__db.query("SELECT ruleforShort, explanation FROM SemancticRule WHERE SemancticRule.ruleforShort LIKE %s", (text))

   def searchExactSemanticRules(self, text):
      return self.__db.query("SELECT ruleforShort, explanation FROM SemancticRule WHERE SemancticRule.ruleforShort= %s", (text))
