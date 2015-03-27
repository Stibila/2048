SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `2048` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `2048` ;

-- -----------------------------------------------------
-- Table `2048`.`player`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `2048`.`player` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ip` BIGINT NOT NULL,
  `user_agent` TEXT NULL,
  `uuid` VARCHAR(45) NOT NULL,
  `birth_year` INT NULL,
  `experiences` INT NULL,
  `gender` CHAR NOT NULL,
  `weekly` INT NOT NULL,
  `action` TINYINT(4) NOT NULL,
  `shooter` TINYINT(4) NOT NULL,
  `adventure` TINYINT(4) NOT NULL,
  `rpg` TINYINT(4) NOT NULL,
  `simulation` TINYINT(4) NOT NULL,
  `strategy` TINYINT(4) NOT NULL,
  `sport` TINYINT(4) NOT NULL,
  `logical` TINYINT(4) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uuid_UNIQUE` (`uuid` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `2048`.`game`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `2048`.`game` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `player_id` BIGINT NOT NULL,
  `uuid` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`, `player_id`),
  UNIQUE INDEX `uuid_UNIQUE` (`uuid` ASC),
  INDEX `fk_game_player1_idx` (`player_id` ASC),
  CONSTRAINT `fk_game_player1`
    FOREIGN KEY (`player_id`)
    REFERENCES `2048`.`player` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `2048`.`move`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `2048`.`move` (
  `game_id` BIGINT NOT NULL,
  `move` INT NOT NULL,
  `direction` CHAR NULL,
  `score` INT NOT NULL,
  `timestamp` BIGINT NOT NULL,
  `b1` INT NULL,
  `b2` INT NULL,
  `b3` INT NULL,
  `b4` INT NULL,
  `b5` INT NULL,
  `b6` INT NULL,
  `b7` INT NULL,
  `b8` INT NULL,
  `b9` INT NULL,
  `b10` INT NULL,
  `b11` INT NULL,
  `b12` INT NULL,
  `b13` INT NULL,
  `b14` INT NULL,
  `b15` INT NULL,
  `b16` INT NULL,
  PRIMARY KEY (`game_id`, `move`),
  INDEX `fk_move_game_idx` (`game_id` ASC),
  CONSTRAINT `fk_move_game`
    FOREIGN KEY (`game_id`)
    REFERENCES `2048`.`game` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `2048`.`eyetracking`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `2048`.`eyetracking` (
  `move_game_id` BIGINT NOT NULL,
  `move_move` INT NOT NULL,
  `hits` INT NOT NULL,
  `hit_b1` VARCHAR(45) NULL,
  `hit_b2` VARCHAR(45) NULL,
  `hit_b3` VARCHAR(45) NULL,
  `hit_b4` VARCHAR(45) NULL,
  `hit_b5` VARCHAR(45) NULL,
  `hit_b6` VARCHAR(45) NULL,
  `hit_b7` VARCHAR(45) NULL,
  `hit_b8` VARCHAR(45) NULL,
  `hit_b9` VARCHAR(45) NULL,
  `hit_b10` VARCHAR(45) NULL,
  `hit_b11` VARCHAR(45) NULL,
  `hit_b12` VARCHAR(45) NULL,
  `hit_b13` VARCHAR(45) NULL,
  `hit_b14` VARCHAR(45) NULL,
  `hit_b15` VARCHAR(45) NULL,
  `hit_b16` VARCHAR(45) NULL,
  PRIMARY KEY (`move_game_id`, `move_move`),
  CONSTRAINT `fk_eyetracking_move1`
    FOREIGN KEY (`move_game_id` , `move_move`)
    REFERENCES `2048`.`move` (`game_id` , `move`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
