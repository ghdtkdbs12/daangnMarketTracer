# daangnMarketTracer

중고거래 플랫폼 "당근마켓"의 Node.js 웹크롤링 Code.
Node.js를 활용하여 MySQL에 데이터를 저장하게 해주는 JavaScript 코드입니다.
.

# How to use ???
1. MySQL 데이터베이스 만들기.
MySQL에 데이터베이스를 직접 만들거나 MySQLBuildCode.js파일의 코드를 작동시켜 DB를 만듭니다.

2. MySQL 연결
저장 할 MySQL의 host, user, password, database 정보를 입력하여 MySQL과 연결합니다.

3. URL 크롤링 범위 지정
mian.js 파일에서,
변수 "Count_StartPage"의 값에 시작할 URL코드 숫자번호를,
변수 "Count_EndPage"에 크롤링을 끝낼 URL 코드 숫자번호를 입력합니다.

4. 동작
코드를 동작시켜 데이터를 추출합니다.
자바스크립트 코드에서 우선 배열로 정보를 받아온 뒤 MySQL에 저장합니다.

5. 저장되는 내용
MySQL에 저장되는 내용은 "순서", "URL주소", "글 제목", "가격", "분류", "장소(대분류)", "장소(중분류)", "장소(소분류)" ,"판매자 닉네임" ,"매너온도" ,"MySQL에 입력된 시간"이 추가됩니다.


.
# 부록: MySQL DB Build code
        `CREATE TABLE 'testdb'.'carretdb' (
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
