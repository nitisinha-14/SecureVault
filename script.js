const statusText =
document.getElementById("status");

const progressBar =
document.getElementById("progressBar");

const fileInput =
document.getElementById("fileInput");

const dropArea =
document.getElementById("dropArea");

["dragenter", "dragover"].forEach(eventName => {

    dropArea.addEventListener(eventName, (e) => {

        e.preventDefault();

        dropArea.style.background =
        "rgba(0,255,153,0.08)";
    });
});


["dragleave", "drop"].forEach(eventName => {

    dropArea.addEventListener(eventName, (e) => {

        e.preventDefault();

        dropArea.style.background =
        "transparent";
    });
});


dropArea.addEventListener("drop", (e) => {

    fileInput.files =
    e.dataTransfer.files;
});

// PASSWORD KEY

function generateKey(password){

    let key = 0;

    for(let i = 0; i < password.length; i++){

        key += password.charCodeAt(i);
    }

    return key % 256;
}

// PROGRESS BAR

function updateProgress(){

    const progressContainer =
    document.querySelector(".progress-container");

    progressContainer.style.display =
    "block";

    let width = 0;

    progressBar.style.width = "0%";

    const interval = setInterval(() => {

        width += 5;

        progressBar.style.width =
        width + "%";

        if(width >= 100){

            clearInterval(interval);

            setTimeout(() => {

                progressContainer.style.display =
                "none";

            }, 500);
        }

    }, 40);
}

// ENCRYPT FILE

function encryptFile(){

    if(!fileInput.files.length){

        alert("Select a file");

        return;
    }

    const password =
    document.getElementById(
        "encryptionPassword"
    ).value;


    if(password === ""){

        alert("Enter password");

        return;
    }

    updateProgress();

    const file =
    fileInput.files[0];

    const reader =
    new FileReader();


    reader.onload = function(e){

        const data =
        new Uint8Array(e.target.result);

        const encrypted =
        new Uint8Array(data.length);

        const KEY =
        generateKey(password);


        for(let i = 0; i < data.length; i++){

            encrypted[i] =
            data[i] ^ KEY;
        }

        const blob =
        new Blob([encrypted]);


        showResult(
            blob,
            file.name + ".encrypted"
        );


        statusText.innerText =
        "🔐 Encryption Successful";
    }

    reader.readAsArrayBuffer(file);
}

// DECRYPT FILE

function decryptFile(){

    if(!fileInput.files.length){

        alert("Select encrypted file");

        return;
    }

    const password =
    document.getElementById(
        "encryptionPassword"
    ).value;


    if(password === ""){

        alert("Enter password");

        return;
    }

    updateProgress();

    const file =
    fileInput.files[0];


    if(!file.name.endsWith(".encrypted")){

        alert(
            "Please select encrypted file"
        );

        return;
    }

    const reader =
    new FileReader();


    reader.onload = function(e){

        const data =
        new Uint8Array(e.target.result);

        const decrypted =
        new Uint8Array(data.length);

        const KEY =
        generateKey(password);


        for(let i = 0; i < data.length; i++){

            decrypted[i] =
            data[i] ^ KEY;
        }

        const originalName =
        file.name.replace(
            ".encrypted",
            ""
        );

        const blob =
        new Blob([decrypted]);


        showResult(
            blob,
            originalName
        );


        statusText.innerText =
        "🔓 Decryption Successful";
    }

    reader.readAsArrayBuffer(file);
}

// SHOW RESULT PANEL

function showResult(blob, filename){

    const resultPanel =
    document.querySelector(".result-panel");

    const resultBox =
    document.getElementById("resultBox");

    const resultFileName =
    document.getElementById("resultFileName");

    const downloadBtn =
    document.getElementById("downloadBtn");


    // SHOW PANEL

    resultPanel.style.display =
    "block";


    // SHOW RESULT BOX

    resultBox.style.display =
    "block";


    // FILE NAME

    resultFileName.innerText =
    filename;


    // FILE URL

    const fileURL =
    URL.createObjectURL(blob);


    // DOWNLOAD BUTTON

    downloadBtn.onclick = function(){

        const link =
        document.createElement("a");

        link.href = fileURL;

        link.download = filename;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };
}
