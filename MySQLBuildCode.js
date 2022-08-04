/**
 * MySQL DB만들어주는 MySQL 명령어
 * 직접 MySQL에 만들시 사용하세요.
 * --------------------------------------
 * CREATE TABLE `testdb`.`carretdb` (
  `IDX` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `URL` VARCHAR(100) NOT NULL,
  `Title` VARCHAR(100) CHARACTER SET 'utf8mb4' NOT NULL,
  `Price` VARCHAR(45) CHARACTER SET 'utf8mb4' NOT NULL,
  `Classification` VARCHAR(100) NOT NULL,
  `Region` VARCHAR(60) NOT NULL,
  `Province` VARCHAR(40) NOT NULL,
  `Local` VARCHAR(40) NOT NULL,
  `Nickname` VARCHAR(44) CHARACTER SET 'utf8mb4' NOT NULL,
  `Temperature` VARCHAR(45) NOT NULL,
  `UpdateTime` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`IDX`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
 */

const mysql = require("mysql2/promise");

//------------------------------
/** MySQL 정보입력!!
 * 사용할 DB 정보를 입력하세요.
 */
const pool = mysql.createPool({
    host: '',
    user: '',
    password: '',
    database: ''
});
//------------------------------

//데이터베이스 MySQL code

const conn = await pool.getConnection();
try {

    //DB만드는 코드
    const buildDB =
        `CREATE TABLE 'crawlingdb'.'carretdb' (
                'IDX' BIGINT(20) NOT NULL AUTO_INCREMENT,
                'URL' VARCHAR(100) NOT NULL,
                'Title' VARCHAR(100) CHARACTER SET 'utf8mb4' NOT NULL,
                'Price' VARCHAR(45) CHARACTER SET 'utf8mb4' NOT NULL,
                'Classification' VARCHAR(100) NOT NULL,
                'Region' VARCHAR(60) NOT NULL,
                'Province' VARCHAR(40) NOT NULL,
                'Local' VARCHAR(40) NOT NULL,
                'Nickname' VARCHAR(44) CHARACTER SET 'utf8mb4' NOT NULL,
                'Temperature' VARCHAR(45) NOT NULL,
                'UpdateTime' VARCHAR(45) NOT NULL,
                PRIMARY KEY ('IDX'))
              ENGINE = InnoDB
              DEFAULT CHARACTER SET = utf8mb4;`;
    console.log('start SQL Build code');
    const [result] = await conn.query(buildDB);
    console.log("MySQL Build....");
    //console.log(result)
    if (result.ok) {
        console.log("result: ", result.ok);
    } else {
        console.log('에러: DB를 만들지 못 했습니다.');
    }
} catch (error) {
    console.log('에러: DB를 만들지 못 했습니다.');
} finally {
    conn.release();
    console.log("완료되었습니다.");
}