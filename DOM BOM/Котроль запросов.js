/*Функционал для прерывания HTTP запросов */
const controller = new AbortController();
const { signal } = controller; //передать в option fetch 
const timeoutSignal = AbortSignal.timeout(5000);//или это передать в options на signal для автоматического прерывания
controller.abort();//прерывать руками

//Пример:
const url = "video.mp4";

try {
  const res = await fetch(url, { signal: timeoutSignal });
  const result = await res.blob();
  // …
} catch (err) {
  if (err.name === "TimeoutError") {
    console.error("Timeout: It took more than 5 seconds to get the result!");
  } else if (err.name === "AbortError") {
    console.error(
      "Fetch aborted by user action (browser stop button, closing tab, etc.",
    );
  } else if (err.name === "TypeError") {
    console.error("AbortSignal.timeout() method is not supported");
  } else {
    // A network error, or some other problem.
    console.error(`Error: type: ${err.name}, message: ${err.message}`);
  }
}

//Вариант для объединения обоих возможностей прервать
const res = await fetch(url, {
  // This will abort the fetch when either signal is aborted
  signal: AbortSignal.any([controller.signal, timeoutSignal]),
});
//any не работает в FireFox и в Самсунг Интернет
//Есть вариант отслеживания состояния сигнала что бы среагировать в Promise
function myCoolPromiseAPI(/* …, */ { signal }) {
  return new Promise((resolve, reject) => {
    //Если сигнал уже прерван, выкинем ошибку.
    (signal.aborted) && reject(signal.reason);
    //или по факту прослушаем
    signal.addEventListener("abort", () => {
      reject(signal.reason);
    });

  });
}