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
  `ip` INT NOT NULL,
  `user_agent` TEXT NULL,
  `uuid` VARCHAR(45) NOT NULL,
  `birth_year` INT NULL,
  `experiences` INT NULL,
  `gender` CHAR NOT NULL,
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


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
