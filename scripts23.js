const recordBtn = document.querySelector(".record"),
  result = document.querySelector(".result"),
  createReportBtn = document.querySelector(".create-report"),
  inputLanguage = document.querySelector("#language"),
  clearBtn = document.querySelector(".clear");

let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition,
  recognition,
  recording = false;

// Initialize patient data
let patientData = {
  name: "",
  age: "",
  gender: "",
  symptoms: []
};

let currentField = 'name';  // Track which field we are filling

function populateLanguages() {
  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang.code;
    option.innerHTML = lang.name;
    inputLanguage.appendChild(option);
  });
}

populateLanguages();

function speechToText() {
  try {
    recognition = new SpeechRecognition();
    recognition.lang = inputLanguage.value;
    recognition.interimResults = true;
    recordBtn.classList.add("recording");
    recordBtn.querySelector("p").innerHTML = `Listening for ${currentField}...`;
    recognition.start();

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;

      if (event.results[0].isFinal) {
        updatePatientData(speechResult);
        
        if (currentField !== 'completed') {
          recordBtn.querySelector("p").innerHTML = `Listening for ${currentField}...`;
        } else {
          displayPatientInfo();
          createReportBtn.disabled = false;
          recordBtn.querySelector("p").innerHTML = "Start Listening";
          stopRecording();
        }
      } else {
        if (!document.querySelector(".interim")) {
          const interim = document.createElement("p");
          interim.classList.add("interim");
          result.appendChild(interim);
        }
        document.querySelector(".interim").innerHTML = " " + speechResult;
      }
    };

    recognition.onspeechend = () => {
      if (currentField !== 'completed') {
        speechToText(); // Continue listening if not completed
      }
    };

    recognition.onerror = (event) => {
      stopRecording();
      alert("Error occurred in recognition: " + event.error);
    };

  } catch (error) {
    recording = false;
    console.log(error);
  }
}

recordBtn.addEventListener("click", () => {
  if (!recording) {
    currentField = 'name'; // Reset to start with the name field
    speechToText();
    recording = true;
  } else {
    stopRecording();
  }
});

function stopRecording() {
  recognition.stop();
  recordBtn.querySelector("p").innerHTML = "Start Listening";
  recordBtn.classList.remove("recording");
  recording = false;
}

function updatePatientData(speechResult) {
  switch (currentField) {
    case 'name':
      patientData.name = speechResult.trim();
      currentField = 'age';
      break;
    case 'age':
      patientData.age = speechResult.trim();
      currentField = 'gender';
      break;
    case 'gender':
      patientData.gender = speechResult.trim();
      currentField = 'symptoms';
      break;
    case 'symptoms':
      patientData.symptoms = speechResult.split(",").map(s => s.trim());
      currentField = 'completed';
      break;
  }
}

function displayPatientInfo() {
  result.innerHTML = `
    <strong>Name:</strong> ${patientData.name}<br>
    <strong>Age:</strong> ${patientData.age}<br>
    <strong>Gender:</strong> ${patientData.gender}<br>
    <strong>Symptoms:</strong> ${patientData.symptoms.join(", ")}<br>
  `;
  result.querySelector(".interim")?.remove();
}

createReportBtn.addEventListener("click", () => {
  const reportContent = generateReport(patientData);
  openReportWindow(reportContent);
});

function generateReport(patientInfo) {
  return `
    <h2>Medical Report</h2>
    <p><strong>Name:</strong> ${patientInfo.name}</p>
    <p><strong>Age:</strong> ${patientInfo.age}</p>
    <p><strong>Gender:</strong> ${patientInfo.gender}</p>
    <h3>Symptoms:</h3>
    <ul>
      ${patientInfo.symptoms.map(symptom => `<li>${symptom}</li>`).join("")}
    </ul>
    <p>This patient has been diagnosed with the following condition(s):</p>
    <ol>
      ${patientInfo.symptoms.map(symptom => `<li>${symptom}</li>`).join("")}
    </ol>
    <p>Prescribed medication: Acetaminophen 500mg every 6 hours.</p>
    <p>Follow-up appointment scheduled for next week.</p>
  `;
}

function openReportWindow(content) {
  const newWindow = window.open("report.html", "_blank", "width=600,height=400");
  newWindow.onload = () => {
    newWindow.document.getElementById("report-content").innerHTML = content;
  };
}

clearBtn.addEventListener("click", () => {
  result.innerHTML = "";
  createReportBtn.disabled = true;
  patientData = { name: "", age: "", gender: "", symptoms: [] };
  currentField = 'name';
});
