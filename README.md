# daangnMarketTracer

중고거래 플랫폼 "당근마켓"의 Node.js 웹크롤링 Code.
Node.js를 활용하여 MySQL에 데이터를 저장하게 해주는 JavaScript 코드입니다.


# How to use ???
1. MySQL 연결
저장 할 MySQL의 host, user, password, database 정보를 입력하여 MySQL과 연결합니다.

2. URL 크롤링 범위 지정
mian.js 파일에서,
변수 "Count_StartPage"의 값에 시작할 URL코드 숫자번호를,
변수 "Count_EndPage"에 크롤링을 끝낼 URL 코드 숫자번호를 입력합니다.

3. 동작
코드를 동작시켜 데이터를 추출합니다.
자바스크립트 코드에서 우선 배열로 정보를 받아온 뒤 MySQL에 저장합니다.

4. 저장되는 내용
MySQL에 저장되는 
