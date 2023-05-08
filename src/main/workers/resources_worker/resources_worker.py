from nameko.rpc import rpc
from dotenv import load_dotenv
import os
import pymysql
from ResourcesDAO import ResourcesDAO
from nameko.standalone.rpc import ServiceRpcProxy
import json

current_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path="{}/.env".format(current_dir))

def rpc_proxy(service):
    config = {'AMQP_URI': os.getenv('AMQP_URI')}
    return ServiceRpcProxy(service, config)

class ResourcesService:
    name = "resources_service"
    
    ##############################################################
    #################### Get methods #############################
    ##############################################################

    @rpc
    def get_all_adjectives(self):
        __ResourcesDAO = ResourcesDAO()

        adjectivesList=__ResourcesDAO.getAllAdjectives()

        __ResourcesDAO.close()
        return adjectivesList
    
    @rpc
    def get_all_semantic_rules(self):
        __ResourcesDAO = ResourcesDAO()
      
        rulesList=__ResourcesDAO.getAllSemanticRules()

        __ResourcesDAO.close()
        return rulesList

    @rpc
    def get_all_acronyms(self):
        __ResourcesDAO = ResourcesDAO()
      
        acronymsList=__ResourcesDAO.getAllAcronyms()

        __ResourcesDAO.close()
        return acronymsList


    ##############################################################
    #################### Add methods #############################
    ##############################################################

    @rpc
    def add_acronym(self, letters, meaning):
        __ResourcesDAO = ResourcesDAO()
      
        __ResourcesDAO.insertAcronym(letters, meaning)

        __ResourcesDAO.close()
        
    @rpc
    def add_adjective(self, adjective, usages):
        __ResourcesDAO = ResourcesDAO()
      
        __ResourcesDAO.insertAdjective(adjective, usages)

        __ResourcesDAO.close()
        
    @rpc
    def add_semantic_rule(self, ruleforShort, explanation):
        __ResourcesDAO = ResourcesDAO()
      
        __ResourcesDAO.insertSemanticRule(ruleforShort, explanation)

        __ResourcesDAO.close()
        
    ##############################################################
    ################### Check methods ############################
    ##############################################################

    @rpc
    def exists_acronym(self, letters):
        __ResourcesDAO = ResourcesDAO()
      
        acronym =__ResourcesDAO.getAcronymID(letters)
       
        __ResourcesDAO.close()
        
        if acronym is None:
            return True

        return False
        
    @rpc
    def exists_adjective(self, adjective):
        __ResourcesDAO = ResourcesDAO()
      
        adjective =__ResourcesDAO.getAdjectiveID(adjective)
       
        __ResourcesDAO.close()

        if adjective is None:
            return True

        return False
        
    @rpc
    def exists_semantic_rule(self, ruleforShort):
        __ResourcesDAO = ResourcesDAO()
      
        rule =__ResourcesDAO.getSemanticRuleID(ruleforShort)
       
        __ResourcesDAO.close()

        if rule is None:
            return True

        return False

    ##############################################################
    ################### Modify methods ###########################
    ##############################################################

    @rpc
    def modify_acronym(self, previousLetters, newLetters, meaning):
        __ResourcesDAO = ResourcesDAO()

        acronymID=__ResourcesDAO.getAcronymID(previousLetters).get("id")

        __ResourcesDAO.updateAcronym(acronymID, newLetters, meaning)

        __ResourcesDAO.close()
        
    @rpc
    def modify_adjective(self, previousAdjective, newAdjective, usages):
        __ResourcesDAO = ResourcesDAO()
      
        adjectiveID=__ResourcesDAO.getAdjectiveID(previousAdjective).get("id")

        __ResourcesDAO.updateAdjective(adjectiveID, newAdjective, usages)

        __ResourcesDAO.close()
        
    @rpc
    def modify_semantic_rule(self, previousRuleforShort, newRuleforShort, explanation):
        __ResourcesDAO = ResourcesDAO()
      
        semanticRuleID=__ResourcesDAO.getSemanticRuleID(previousRuleforShort).get("id")

        __ResourcesDAO.updateSemanticRule(semanticRuleID, newRuleforShort, explanation)

        __ResourcesDAO.close()
    

    ##############################################################
    ################### Delete methods ###########################
    ##############################################################

    @rpc
    def delete_acronym(self, letters):
        __ResourcesDAO = ResourcesDAO()
      
        acronymID=__ResourcesDAO.getAcronymID(letters).get("id")

        __ResourcesDAO.deleteAcronym(acronymID)

        __ResourcesDAO.close()
        
    @rpc
    def delete_adjective(self, adjective):
        __ResourcesDAO = ResourcesDAO()
      
        adjectiveID=__ResourcesDAO.getAdjectiveID(adjective).get("id")

        __ResourcesDAO.deleteAdjective(adjectiveID)

        __ResourcesDAO.close()
        
    @rpc
    def delete_semantic_rule(self, ruleforShort):
        __ResourcesDAO = ResourcesDAO()
      
        semanticRuleID=__ResourcesDAO.getSemanticRuleID(ruleforShort).get("id")

        __ResourcesDAO.deleteSemanticRule(semanticRuleID)

        __ResourcesDAO.close()
    
    ##############################################################
    ################### Search methods ###########################
    ##############################################################

    @rpc
    def search_text(self, text, mode):
        __ResourcesDAO = ResourcesDAO()
        
        acronymsList=[]
        adjectivesList=[]
        rulesList=[]
        searchedData=None
        if(mode=="exact"):
            acronymsList=__ResourcesDAO.searchExactAcronyms(text).fetchall()
            adjectivesList=__ResourcesDAO.searchExactAdjectives(text).fetchall()
            rulesList=__ResourcesDAO.searchExactSemanticRules(text).fetchall()
        else:
            acronymsList=__ResourcesDAO.searchAcronyms('%'+text+'%').fetchall()
            adjectivesList=__ResourcesDAO.searchAdjectives('%'+text+'%').fetchall()
            rulesList=__ResourcesDAO.searchSemanticRules('%'+text+'%').fetchall()
            
        searchedData= ResourcesService.get_search_resources(acronymsList, adjectivesList, rulesList)
        __ResourcesDAO.close()
        return searchedData

    @staticmethod
    def get_search_resources(acronymsList, adjectivesList, rulesList):
        acronymsInfo=[]
        adjectivesInfo=[]
        rulesInfo=[]
        for acronym in acronymsList:
            acronymsInfo.append({"letters":acronym.get("letters"),"meaning":acronym.get("meaning")}) 
        for adjective in adjectivesList:
            adjectivesInfo.append({"adjective":adjective.get("adjective"),"usages":adjective.get("usages")}) 
        for rule in rulesList:
            rulesInfo.append({"ruleforShort":rule.get("ruleforShort"),"explanation":rule.get("explanation")})
            
        return {"acronyms": acronymsInfo, "adjectives":adjectivesInfo, "semantic_rules":rulesInfo}
