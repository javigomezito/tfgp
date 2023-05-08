import unittest
import pymysql
from src.main.workers.resources_worker import resources_worker

'''
def rpc_proxy(service):
    config = {'AMQP_URI': os.getenv('AMQP_URI')}
    return ServiceRpcProxy(service, config)
'''

class testGuarda(unittest.TestCase):

    def test_get_all_adjectives(self):        
        data= resources_worker.ResourcesService.get_all_adjectives(self)

        print(data)
        self.fail()


    def test_get_all_acronyms(self):        
        data= resources_worker.ResourcesService.get_all_acronyms(self)

        print(data)
        self.fail()


    def test_get_all_semantic_rules(self):        
        data= resources_worker.ResourcesService.get_all_semantic_rules(self)

        print(data)
        self.fail()
