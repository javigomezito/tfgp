

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';


-- -----------------------------------------------------
-- Schema Loco
-- -----------------------------------------------------*/
DROP SCHEMA IF EXISTS Loco;

-- -----------------------------------------------------
-- Schema Loco
-- -----------------------------------------------------
CREATE SCHEMA Loco CHARACTER SET utf8;



USE Loco;

-- -----------------------------------------------------
-- Table "Loco"."Module"
-- -----------------------------------------------------
DROP TABLE IF EXISTS Module;

CREATE TABLE Module (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY name_UNIQUE (name)
);

INSERT INTO Module
  (name)
VALUES
  ('All');


-- -----------------------------------------------------
-- Table "Loco"."Category"
-- -----------------------------------------------------
DROP TABLE IF EXISTS Category;
CREATE TABLE IF NOT EXISTS Category (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  level INT NULL,
  is_validated TINYINT NOT NULL,
  Super_Category_id INT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_Category_Category1
    FOREIGN KEY (Super_Category_id) REFERENCES Category(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  UNIQUE KEY name_UNIQUE (name),
  KEY fk_Category_Category1_idx (Super_Category_id)
);




-- -----------------------------------------------------
-- Table "Loco"."ProjectTypeOfValue"
-- -----------------------------------------------------
DROP TABLE IF EXISTS ProjectTypeOfValue;

CREATE TABLE IF NOT EXISTS ProjectTypeOfValue (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL COMMENT 'The type of symbol in the project indicates what role this symbol plays: variable, auxiliary variable, historical data series, parameter, constant, scenario parameter, disaggregated variable or multidimensional variable, index, index case.',
  PRIMARY KEY (id),
  UNIQUE KEY name_UNIQUE (name)
);

INSERT INTO ProjectTypeOfValue
  (name)
VALUES
  ('Historical_Data_Series'),
  ('Parameter'),
  ('Constant'),
  ('Scenario_Parameter'),
  ('Disagregated_Variable'),
  ('Index'),
  ('IndexCase');


-- -----------------------------------------------------
-- Table "Loco"."Symbol"
-- -----------------------------------------------------
DROP TABLE IF EXISTS Symbol;

CREATE TABLE IF NOT EXISTS Symbol (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  definition VARCHAR(500) NOT NULL,
  unit VARCHAR(45) NOT NULL,
  is_validated TINYINT NOT NULL,
  is_indexed TINYINT NOT NULL,
  Module_id INT UNSIGNED NOT NULL,
  Category_id INT NOT NULL,
  ProjectTypeOfValue_id INT NOT NULL,
  ProgrammingLanguageSymbolType_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_Symbol_Module1
    FOREIGN KEY (Module_id)
    REFERENCES Module(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_Symbol_Category1
    FOREIGN KEY (Category_id)
    REFERENCES Category (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_Symbol_ProjectTypeOfValue1
    FOREIGN KEY (ProjectTypeOfValue_id)
    REFERENCES ProjectTypeOfValue (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_Symbol_ProgrammingLanguageSymbolType1
    FOREIGN KEY (ProgrammingLanguageSymbolType_id)
    REFERENCES ProgrammingLanguageSymbolType (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  KEY fk_Symbol_Module1_idx (Module_id),
  KEY fk_Symbol_Category1_idx (Category_id),
  KEY fk_Symbol_ProjectTypeOfValue1_idx (ProjectTypeOfValue_id),
  KEY fk_Symbol_ProgrammingLanguageSymbolType1_idx (ProgrammingLanguageSymbolType_id)
);

-- -----------------------------------------------------
-- Table "Loco"."Symbol_used_Module"
-- -----------------------------------------------------
DROP TABLE IF EXISTS Symbol_used_Module;

CREATE TABLE IF NOT EXISTS Symbol_used_Module (
  Symbol_id INT NOT NULL,
  Module_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (Symbol_id, Module_id),
  CONSTRAINT fk_Symbol_has_Module_Symbol
    FOREIGN KEY (Symbol_id)
    REFERENCES Symbol (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_Symbol_has_Module_Module1
    FOREIGN KEY (Module_id)
    REFERENCES Module (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  KEY fk_Symbol_has_Module_Module1_idx (Module_id),
  KEY fk_Symbol_has_Module_Symbol_idx (Symbol_id)
);



-- -----------------------------------------------------
-- Table "Loco"."Roles"
-- -----------------------------------------------------
DROP TABLE IF EXISTS Roles;

CREATE TABLE IF NOT EXISTS Roles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO Roles
  (name)
VALUES
  ('Project Leader'),
  ('Module Supervisor'),
  ('Module Programmer'),
  ('Guest'),
  ('General Supervisor'),
  ('Quality Assurance');


-- -----------------------------------------------------
-- Table "Loco"."User"
-- -----------------------------------------------------
DROP TABLE IF EXISTS User;

CREATE TABLE IF NOT EXISTS User (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(45) NOT NULL,
  full_name VARCHAR(255) NULL,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(45) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO User
  (username, full_name, password, email)
VALUES
  ('admin', 'Admin', '$pbkdf2-sha256$20000$cS6lNEbI2ZuTMiZEqJUSYg$GeXH8L89JhsaLZc9Xkk2UoEhSDZ0eNIxevMhfw9.gAA', ''),
  ('guest', 'guest', '$pbkdf2-sha256$20000$AuCcE2IsBQBgTKnVGqN0jg$25DPUUhU4QtiNaHzyelVh0H0Qhs.zn4jnLsb3HyQ8VM', ''),
  ('QATeam', 'QATeam', '$pbkdf2-sha256$20000$hfCeE8J4jzHmHCMEQOg95w$.RRhZd5hfYQPDzlxjNaawq3/zekrOaLHciveKCjST8o', '');

-- -----------------------------------------------------
-- Table "Loco"."user_session_time"
-- -----------------------------------------------------
DROP TABLE IF EXISTS user_session_time;

CREATE TABLE IF NOT EXISTS user_session_time (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  User_id INT UNSIGNED NOT NULL,
  token VARCHAR(30) NOT NULL,
  datatime VARCHAR(30) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_user_session_time_User1
    FOREIGN KEY (User_id)
    REFERENCES User (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  KEY fk_user_session_time_User1_idx (User_id)
);



-- -----------------------------------------------------
-- Table "Loco"."user_role_module"
-- -----------------------------------------------------
DROP TABLE IF EXISTS user_role_module ;

CREATE TABLE IF NOT EXISTS user_role_module (
  id INT NOT NULL AUTO_INCREMENT,
  Module_id INT UNSIGNED NOT NULL,
  Roles_id INT UNSIGNED NOT NULL,
  User_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_user_role_module_Module1
    FOREIGN KEY (Module_id)
    REFERENCES Module (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_user_role_module_Roles1
    FOREIGN KEY (Roles_id)
    REFERENCES Roles (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_user_role_module_User1
    FOREIGN KEY (User_id)
    REFERENCES User (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  KEY fk_user_role_module_Module1_idx (Module_id),
  KEY fk_user_role_module_Roles1_idx (Roles_id),
  KEY fk_user_role_module_User1_idx (User_id)
);

INSERT INTO user_role_module
  (Module_id, Roles_id, User_id)
VALUES
  (1, 1, 1),
  (1, 4, 2),
  (1, 6, 3);



-- -----------------------------------------------------
-- Table "Loco"."ProgrammingLanguageSymbolType"
-- -----------------------------------------------------
DROP TABLE IF EXISTS ProgrammingLanguageSymbolType;

CREATE TABLE IF NOT EXISTS ProgrammingLanguageSymbolType (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL COMMENT 'Types of symbols that can be used in the language (in Vensim).',
  PRIMARY KEY (id)
);


INSERT INTO ProgrammingLanguageSymbolType
  (name)
VALUES
  ('Variable'),
  ('Constant'),
  ('Subscript'),
  ('Subscript_Value'),
  ('Variable_Subscripted'),
  ('Constant_Subscripted'),
  ('Function'),
  ('Lookup_table'),
  ('Reality_Check'),
  ('Switches');
-- -----------------------------------------------------
-- Table "Loco"."ProjectTypeOfValue_has_VensimSymbolType"
-- -----------------------------------------------------
DROP TABLE IF EXISTS ProjectTypeOfValue_has_VensimSymbolType;

CREATE TABLE IF NOT EXISTS ProjectTypeOfValue_has_VensimSymbolType (
  ProjectTypeOfValue_id INT NOT NULL COMMENT 'A relationship between the types of symbols in the project and the types of symbols in the language. Thus, for example, an index is defined through the definition of a subscript in Vensim. A series of historical data can be defined with a lookup table or a subscripted variable, a parameter can be defined with a switch (variable that is worth 0, 1, 2, 3 and that is used in constructions of type IF… THEN… ELSE IF ... THEN ... ELSE ...',
  VensimSymbolType_id INT NOT NULL,
  PRIMARY KEY (ProjectTypeOfValue_id, VensimSymbolType_id),
  CONSTRAINT fk_ProjectTypeOfValue_has_VensimSymbolType_ProjectTypeOfValue1
    FOREIGN KEY (ProjectTypeOfValue_id)
    REFERENCES ProjectTypeOfValue (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_ProjectTypeOfValue_has_VensimSymbolType_VensimSymbolType1
    FOREIGN KEY (VensimSymbolType_id)
    REFERENCES ProgrammingLanguageSymbolType (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  KEY fk_ProjectTypeOfValue_has_VensimSymbolType_VensimSymbolType_idx (VensimSymbolType_id),
  KEY fk_ProjectTypeOfValue_has_VensimSymbolType_ProjectTypeOfVal_idx (ProjectTypeOfValue_id)
);


-- -----------------------------------------------------
-- Table "Loco"."IndexI"
-- -----------------------------------------------------
DROP TABLE IF EXISTS IndexI;

CREATE TABLE IF NOT EXISTS IndexI (
  id INT NOT NULL AUTO_INCREMENT,
  index_name VARCHAR(255) NOT NULL,
  is_validated TINYINT NOT NULL,
  definition VARCHAR(500) NOT NULL,
  PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- Table "Loco"."Symbol_has_Index"
-- -----------------------------------------------------
DROP TABLE IF EXISTS Symbol_has_Index;

CREATE TABLE IF NOT EXISTS Symbol_has_Index (
  Index_id INT NOT NULL,
  Symbol_id INT NOT NULL,
  PRIMARY KEY (Index_id, Symbol_id),
  CONSTRAINT fk_Index_has_Symbol_Index1
    FOREIGN KEY (Index_id)
    REFERENCES IndexI (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_Index_has_Symbol_Symbol1
    FOREIGN KEY (Symbol_id)
    REFERENCES Symbol (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  KEY fk_Index_has_Symbol_Symbol1_idx (Symbol_id),
  KEY fk_Index_has_Symbol_Index1_idx (Index_id)
);



-- -----------------------------------------------------
-- Table "Loco"."IndexValue"
-- -----------------------------------------------------
DROP TABLE IF EXISTS IndexValue ;

CREATE TABLE IF NOT EXISTS IndexValue (
  id INT NOT NULL AUTO_INCREMENT,
  value_name VARCHAR(45) NOT NULL,
  PRIMARY KEY (id)
);


-- -----------------------------------------------------
-- Table "Loco"."Adjective"
-- -----------------------------------------------------
DROP TABLE IF EXISTS Adjective ;

CREATE TABLE IF NOT EXISTS Adjective (
  id INT NOT NULL AUTO_INCREMENT,
  adjective VARCHAR(100) NOT NULL,
  usages VARCHAR(500) NULL,
  PRIMARY KEY (id)
);


-- -----------------------------------------------------
-- Table "Loco"."Acronym"
-- -----------------------------------------------------
DROP TABLE IF EXISTS Acronym ;

CREATE TABLE IF NOT EXISTS Acronym (
  id INT NOT NULL AUTO_INCREMENT,
  letters VARCHAR(45) NOT NULL,
  meaning VARCHAR(500) NULL,
  PRIMARY KEY (id)
);


-- -----------------------------------------------------
-- Table "Loco"."SemancticRule"
-- -----------------------------------------------------
DROP TABLE IF EXISTS SemancticRule;

CREATE TABLE IF NOT EXISTS SemancticRule (
  id INT NOT NULL AUTO_INCREMENT,
  ruleforShort VARCHAR(45) NOT NULL,
  explanation VARCHAR(500) NULL,
  PRIMARY KEY (id)
);


-- -----------------------------------------------------
-- Table "Loco"."Index_has_IndexValue"
-- -----------------------------------------------------
DROP TABLE IF EXISTS Index_has_IndexValue;

CREATE TABLE IF NOT EXISTS Index_has_IndexValue (
  Index_id INT NOT NULL,
  IndexValue_id INT NOT NULL,
  PRIMARY KEY (Index_id, IndexValue_id),
  CONSTRAINT fk_Index_has_IndexValue_Index1
    FOREIGN KEY (Index_id)
    REFERENCES IndexI (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_Index_has_IndexValue_IndexValue1
    FOREIGN KEY (IndexValue_id)
    REFERENCES IndexValue (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  KEY fk_Index_has_IndexValue_IndexValue1_idx (IndexValue_id),
  KEY fk_Index_has_IndexValue_Index1_idx (Index_id)
);



-- -----------------------------------------------------
-- Table "Loco"."ProjectTypeOfValue_has_ProgrammingLanguageSymbolType"
-- -----------------------------------------------------
DROP TABLE IF EXISTS ProjectTypeOfValue_has_ProgrammingLanguageSymbolType ;

CREATE TABLE IF NOT EXISTS ProjectTypeOfValue_has_ProgrammingLanguageSymbolType (
  ProjectTypeOfValue_id INT NOT NULL,
  ProgrammingLanguageSymbolType_id INT NOT NULL,
  PRIMARY KEY (ProjectTypeOfValue_id, ProgrammingLanguageSymbolType_id),
  CONSTRAINT fk_ProjectTypeOfValue_has_ProgrammingLanguageSymbolType_Proje1
    FOREIGN KEY (ProjectTypeOfValue_id)
    REFERENCES ProjectTypeOfValue (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_ProjectTypeOfValue_has_ProgrammingLanguageSymbolType_Progr1
    FOREIGN KEY (ProgrammingLanguageSymbolType_id)
    REFERENCES ProgrammingLanguageSymbolType (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  KEY fk_ProjectTypeOfValue_has_ProgrammingLanguageSymbolType_Pro_idx (ProgrammingLanguageSymbolType_id),
  KEY fk_ProjectTypeOfValue_has_ProgrammingLanguageSymbolType_Pro_idx1 (ProjectTypeOfValue_id)
);

INSERT INTO ProjectTypeOfValue_has_ProgrammingLanguageSymbolType
  (ProjectTypeOfValue_id, ProgrammingLanguageSymbolType_id)
VALUES 
  (1, 3),
  (1, 4),
  (1, 5),
  (1, 6),
  (2, 1),
  (2, 2),
  (3, 2),
  (4, 7),
  (5, 1),
  (6, 8),
  (7, 9);
  

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

