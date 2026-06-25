async function scan() {
  try {

    const res = await fetch("https://TON-URL.onrender.com/analyze", {
      method: "POST"
    });

    const data = await res.json();

    document.getElementById("result").innerHTML =
      "☠️ " + data.risk_level + "<br>" +
      data.explanation;

  } catch (err) {
    console.log(err);
    document.getElementById("result").innerHTML =
      "❌ API FAIL";
  }
}
