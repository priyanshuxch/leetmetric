document.addEventListener("DOMContentLoaded", function () {

  const searchBtn = document.querySelector(".search-btn");
  const usernameInput = document.querySelector(".user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.querySelector(".easy-label");
  const mediumLabel = document.querySelector(".medium-label");
  const hardLabel = document.querySelector(".hard-label");
  const cardStatsContainer = document.querySelector(".stats-card");

  // return true or false based on regex
  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }

    const regex = /^[a-zA-Z0-9_-]{3,16}$/;
    const isMatching = regex.test(username);
    if(!isMatching) {
      alert("Invalid username");
    }

    return isMatching;
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved/total)*100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(parsedData) {
    // total ques
    const totalQues = parsedData.data.allQuestionsCount[0].count;
    const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
    const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
    const totalHardQues = parsedData.data.allQuestionsCount[3].count;

    // total solved ques
    const totalSolvedQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
    const totalEasySolvedQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
    const totalMediumSolvedQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
    const totalHardSolvedQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

    // populate data in progress circles
    updateProgress(totalEasySolvedQues, totalEasyQues, easyLabel, easyProgressCircle);
    updateProgress(totalMediumSolvedQues, totalMediumQues, mediumLabel, mediumProgressCircle);
    updateProgress(totalHardSolvedQues, totalHardQues, hardLabel, hardProgressCircle);
    
  }

  async function fetchUserDetails(username) {
    searchBtn.textContent = "Searching...";
    searchBtn.disabled = true;

    try {
      const proxyUrl = `https://cors-anywhere.herokuapp.com/`; 
      const targetUrl = `https://leetcode.com/graphql/`;
      const myHeaders = new Headers();
      myHeaders.append("content-type", "application/json");

      const graphql = JSON.stringify({
          query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
          variables: { "username": `${username}` }
      })
      const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: graphql,
          redirect: "follow"
      };

      const response = await fetch(proxyUrl+ targetUrl, requestOptions);

      if(!response.ok) {
        throw new Error("Unable to fetch the user details");
      }
      const parsedData = await response.json();
      console.log("Logging data: ",parsedData);
      displayUserData(parsedData);
    } 

    catch(err) {
      console.error(err);
      statsContainer.innerHTML = `<p>No data Found.</p>`;  
    } 

    finally {
      searchBtn.disabled = false;
      searchBtn.textContent = "Search";
      usernameInput.value = "";
    }
  }

  searchBtn.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log("Logging username: ", username);

    if(validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});