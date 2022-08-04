const axios = require("axios");
const cheerio = require("cheerio");
const mysql = require("mysql2/promise");

//웹크롤링 대상 페이지 number 입력
var count_StartPage = 0; //시작번호
var count_endPage = 0; //종료번호
/**
 * 웹크롤링 대상페이지는 숫자를 입력하여 합니다.
 * 0 부터 10,000,000,000 사이의 값을 입력하여 기입 가능합니다.
 * 이후 184번줄에 가서 MySQL 정보를 입력하세요.
 */

//↓게시글 숫자 Count 하는 전역변수.
var count_forcount = 0; //페이지 크롤링 반복 횟수 저장
var count_AllCountedPost = 0; //전체 카운트 한 글 수
var count_OnSalePost = 0; //판매중일 경우 카운트
var count_SecretPost = 0; //비밀글일 경우 카운트
var count_NullPost = 0; //비어있는 글일 경우 카운트
var count_UnknownPost = 0; //파악 불가능한 게시글
var count_exceptPost = 0; //예외 게시글
var count_TotalPost = 0; //전체 게시글 수

//저장용 전역변수
var save_OnSalePostURLCode = []; //URL코드
var save_itemTitle = []; //제목
var save_price = []; //가격
var save_classification = []; //분류
var save_nickname = []; //글쓴이
var save_temperature = []; //매너 온도
var save_locationProvince = []; //지역(대)
var save_locationRegion = []; //지역(중)z
var save_locationLocal = []; //지역(소)
var save_updateTime = []; //정보취득 시간

//위치 분류하는 함수
function find_LocationFromTwitterdata2(getTwitterLocationData) {
  const twitterLocation = getTwitterLocationData.split(" ");
  save_locationProvince.push(twitterLocation[0]);
  save_locationRegion.push(twitterLocation[1]);
  save_locationLocal.push(twitterLocation[2]);
}

//HTML주소 얻어오는 변수
const getHTML = async (keyword) => {
  return await axios.get(
    "https://www.daangn.com/articles/" + encodeURI(keyword)
  );
};

//웹크롤링하기.
const parsing = async (keyword) => {
  try {
    const html = await getHTML(keyword);
    const $ = cheerio.load(html.data);
    const $courseList = $("html");
    $courseList.each((idx, node) => {
      //↓ Title에서 쉼표(rest) 제거하고 title을 저장하게 해주는 코드
      let BeforeChangeTitleRest = "";
      BeforeChangeTitleRest = $(node)
        .find(`meta[name="twitter:title"]`)
        .attr("content");
      let Save_changeTitleToArray = [...BeforeChangeTitleRest];
      let AfterChangeTitleRest = Save_changeTitleToArray.filter(
        (change) => (change != ",") & (change != `'`)
      );
      let ResultChangeTitle = AfterChangeTitleRest.join("");

      //↓ 매너온도 전체문장에서 숫자(온도)만 가져오기
      let BeforeChangeTemperature = String(
        $(node).find("#article-profile-right").text()
      );
      let save_changeTemperatureToArray = [...BeforeChangeTemperature];
      let AfterChangeTemperature = save_changeTemperatureToArray.filter(
        (change) =>
          (change != " ") &
          (change != `°`) &
          (change != `C`) &
          (change != `\n`) &
          (change != `매`) &
          (change != `너`) &
          (change != `온`) &
          (change != `도`)
      );
      let ResultChangeTemperature = AfterChangeTemperature.join("");

      //↓ 데이터 취득시간 저장하기 (년월일, 시분초)
      const today = new Date();
      const year = today.getFullYear();
      const month = ("0" + (today.getMonth() + 1)).slice(-2);
      const day = ("0" + today.getDate()).slice(-2);
      const hours = ("0" + today.getHours()).slice(-2);
      const minutes = ("0" + today.getMinutes()).slice(-2);
      const seconds = ("0" + today.getSeconds()).slice(-2);

      //데이터 저장하기
      if ($(node).find("#article-title").text() != "") {
        count_OnSalePost += 1; //일반 판매글 ++
        count_TotalPost += 1; //전체 카운트 ++
        console.log(
          $(node).find(`meta[property="og:url"]`).attr("content") +
          " is OnSalePost, total OnSalePost :" +
          count_OnSalePost +
          " / total: " +
          count_TotalPost
        );
        //↓ 배열 변수에 저장하기.
        //일반 게시글정보 가져오기
        save_OnSalePostURLCode.push(
          $(node).find(`meta[property="og:url"]`).attr("content")
        );
        save_itemTitle.push(ResultChangeTitle);
        save_price.push(
          $(node).find(`meta[name="product:price:amount"]`).attr("content")
        );
        save_classification.push(
          $(node).find(`meta[name="product:category"]`).attr("content")
        );
        save_nickname.push($(node).find("#nickname").text());
        save_temperature.push(ResultChangeTemperature);
        //지역 정보 가져오기
        find_LocationFromTwitterdata2(
          $(node).find(`meta[name="twitter:data2"]`).attr("content")
        );
        //시간 정보 가져오기
        save_updateTime.push(year + month + day + hours + minutes + seconds);
      } else if ($(node).find("#no-article").text() != "") {
        count_SecretPost += 1; //비밀글 ++
        count_TotalPost += 1; //전체 카운트 ++
        console.log(
          $(node).find(`meta[property="og:url"]`).attr("content") +
          " is SecretPost, total SecretPost :" +
          count_SecretPost +
          " / total: " +
          count_TotalPost
        );
      } else {
        count_exceptPost += 1; //예외글 ++
        count_TotalPost += 1; //전체 카운트 ++
        console.log(
          $(node).find(`meta[property="og:url"]`).attr("content") +
          "is exceptPost, total exceptPost :" +
          count_exceptPost +
          " / total: " +
          count_TotalPost
        );
      }
    });
  } catch (err) {
    count_UnknownPost += 1; //err발생 파악불가 ++
    count_TotalPost += 1; //전체 카운트 ++
    console.log(
      "err UnknownPost, total UnknownPost :" +
      count_UnknownPost +
      " / total: " +
      count_TotalPost
    );
  }
};
console.log("!!!!!Count_strat!!!!!" + Date());
var startTime = Date();
(async function () {
  for (step = count_StartPage; step < count_endPage; step++) {
    await parsing(step);
    count_forcount++; //반복 횟수 저장
  }

  console.log("!!!!!Count_end!!!!!" + Date() + " ~ " + startTime);
  count_AllCountedPost =
    count_OnSalePost + count_SecretPost + count_NullPost + count_UnknownPost;
  console.log("전체 크롤링한 페이지 수:" + count_AllCountedPost);
  console.log("크롤링 반복 횟수:" + count_forcount);
  console.log("  총 판매글 수:" + count_OnSalePost);
  console.log("  총 비밀글 수:" + count_SecretPost);
  console.log("  총 없는글 수:" + count_NullPost);
  console.log("  총 예외글 수:" + count_exceptPost);
  console.log("  총 파악불가 글:" + count_UnknownPost);
  console.log("-------------");

  /**
   * 사용할 MySQL 의 host, user, password, database 정보를 입력하세요.
   */
  const pool = mysql.createPool({
    host: "",
    user: "",
    password: "",
    database: "",
  });
  console.log(save_OnSalePostURLCode);

  const arr = [];
  for (let i = 0; i < save_OnSalePostURLCode.length; i++) {
    arr.push([
      save_OnSalePostURLCode[i],
      save_itemTitle[i],
      save_price[i],
      save_classification[i],
      save_locationProvince[i],
      save_locationRegion[i],
      save_locationLocal[i],
      save_nickname[i],
      save_temperature[i],
      save_updateTime[i],
    ]);
  }
  try {
    const conn = await pool.getConnection();
    //console.log('----------- start conn --------------');
    try {
      for (let i = 0; i < arr.length; i++) {
        console.log("MySQL Inserting...." + arr[i][0]);
        const query = `
                    INSERT INTO BackendTestDB(URL, Title, Price, Classification, Region, Province, Local, Nickname, Temperature, UpdateTime)
                    VALUES ('${arr[i][0]}', '${arr[i][1]}', '${arr[i][2]}', '${arr[i][3]}', '${arr[i][4]}', '${arr[i][5]}', '${arr[i][6]}', '${arr[i][7]}', '${arr[i][8]}', '${arr[i][9]}');  
                `;
        //console.log('----------- start query --------------');
        const [result] = await conn.query(query);
        //console.log(result)
        if (result.ok) {
          console.log("result: ", result.ok);
        } else {
          //console.log('error');
        }
      }
    } catch (error) {
      //console.log("---------------- query error ------------------");
      //console.log(error);
    } finally {
      conn.release();
      console.log(
        "!!!!!Count_end!!!!!__CountTime : " + startTime + " ~ " + Date()
      );
    }
  } catch (error) {
    //console.log("---------------- error ------------------");
    //console.log(error);
  }
})();