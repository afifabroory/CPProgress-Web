import { getAnalytics } from "firebase/analytics"
import { getDatabase, ref, onValue, query, limitToLast, orderByChild, equalTo } from "firebase/database"
import { app } from "./initialization.js"

const analytics = getAnalytics(app)
const db = getDatabase(app)
//const db = getDatabase()
//connectDatabaseEmulator(db, "localhost", 9000);

const submissionRow = document.querySelector('#lastSubmission')
const acSubmissionRow = document.querySelector('#lastACSubmission')


function taskOnLoad() {
  const dataRef = ref(db, 'submission')

  const last20Query = query(dataRef, limitToLast(20))
  onValue(last20Query, (snapshot) => {
    const problemRef = ref(db, 'problem')
    const submissionData = snapshot.val()
    onValue(problemRef, (snapshot2) => {
      let problemData = snapshot2.val()
      submissionRow.innerHTML = ''

      submissionData.reverse()
      for (var key in submissionData) {
        var submissionStatus = 'text-primary mr-1'
        
        if (submissionData[key]['status'] === 'WA') submissionStatus = 'text-danger mr-1'
        else if (submissionData[key]['status'] === 'AC') submissionStatus = 'text-success mr-1'

        let el = `<tr><td><a href="${problemData[submissionData[key]['problemID']]}">${submissionData[key]['problemID']}</a></td><td>${new Date(submissionData[key]['date']).toLocaleString()}</td><td class="${submissionStatus}"">${submissionData[key]['status']}</td></tr>`
        submissionRow.insertAdjacentHTML('beforeend', el)
      }
    })
  })

  const last10ACQuery = query(dataRef, orderByChild("status"), equalTo("AC"), limitToLast(10))
  onValue(last10ACQuery, (snapshot) => {
    const submissionData = snapshot.val()
    const problemRef = ref(db, 'problem')
    onValue(problemRef, (snapshot2) => {
      let problemData = snapshot2.val()
      acSubmissionRow.innerHTML = ''

      submissionData.reverse()
      for (var key in submissionData) {
        var submissionStatus = 'text-success mr-1'

        let el = `<tr><td><a href="${problemData[submissionData[key]['problemID']]}">${submissionData[key]['problemID']}</a></td><td>${new Date(submissionData[key]['date']).toLocaleString()}</td><td class="${submissionStatus}"">${submissionData[key]['status']}</td></tr>`
        acSubmissionRow.insertAdjacentHTML('beforeend', el)
      }
    })
  })

  const submissionStatusRef = ref(db, 'submissionStatus/overall')
  onValue(submissionStatusRef, (snapshot) => {
    const statusData = snapshot.val()
    var donutData = {
      labels: ['AC', 'WA', 'CTE', 'TLE', 'RTE', 'MLE'],
      datasets: [{
        data: [statusData['AC'], statusData['WA'], statusData['CTE'], statusData['TLE'], statusData['RTE'], statusData['MLE']],
        backgroundColor: ['#00a65a', '#f56954', '#ffa500', '#808080', '#ff0000', '#4f4e4e'],
      }]
    }

    var pieChartCanvas = $('#pieChart').get(0).getContext('2d')
    var pieData = donutData;
    var pieOptions = {maintainAspectRatio: false, responsive: true}

    new Chart(pieChartCanvas, {
      type: 'pie',
      data: pieData,
      options: pieOptions
    })
  })
}

window.onload = taskOnLoad()