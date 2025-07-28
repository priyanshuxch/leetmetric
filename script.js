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
    const totalQues = parsedData.totalQuestions;
    const totalEasyQues = parsedData.totalEasy;
    const totalMediumQues = parsedData.totalMedium;
    const totalHardQues = parsedData.totalHard;

    // total solved ques
    const totalSolvedQues = parsedData.totalSolved;
    const totalEasySolvedQues = parsedData.easySolved;
    const totalMediumSolvedQues = parsedData.mediumSolved;
    const totalHardSolvedQues = parsedData.hardSolved;

    // populate data in progress circles
    updateProgress(totalEasySolvedQues, totalEasyQues, easyLabel, easyProgressCircle);
    updateProgress(totalMediumSolvedQues, totalMediumQues, mediumLabel, mediumProgressCircle);
    updateProgress(totalHardSolvedQues, totalHardQues, hardLabel, hardProgressCircle);

    const cardData = [
      {label:"Acceptance Rate", value:parsedData.acceptanceRate},
      {label:"Ranking", value:parsedData.ranking},
      {label:"Contribution Points", value:parsedData.contributionPoints},
      {label:"Reputation", value:parsedData.reputation},
    ];

    let cardsHTML = '';
    cardData.map((card) => {
      const html = `
        <div class="card">
          <h4>${card.label}</h4>
          <p>${card.value}</p>
        </div>
      `;
      cardsHTML += html;
    });
    
    cardStatsContainer.innerHTML = cardsHTML;
  }

  async function fetchUserDetails(username) {
    searchBtn.textContent = "Searching...";
    searchBtn.disabled = true;

    try {
      const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
      const response = await fetch(url);

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