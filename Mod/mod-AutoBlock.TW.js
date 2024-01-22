const ssid1 = "JJESP-5G";
const ssid2 = "SSID2";
const name = "BlockAD-TWPlus";
let home = ($network.wifi.ssid === ssid1) || ($network.wifi.ssid === ssid2);

const getModuleStatus = new Promise((resolve) => {
  $httpAPI("GET", "v1/modules", null, (data) =>
	  resolve(data.enabled.includes(name))
  );
});

getModuleStatus.then((enabled) => {
  if (home && enabled) {
    //在家，關閉 自動BAD模組 => 關閉
	$notification.post(`關閉 ${name} 模組`, "" ,"");
	enableModule(false);
  } else if (!home && !enabled) {
	//不在家，開啟 自動BAD模組 => 啟用
	$notification.post(`啟用 ${name} 模組`, "" ,"");
	enableModule(true);
  } else {
	//其他情況 => 重複觸發 => 結束腳本
	//$notification.post("重複觸發", "", "");
	$done();
  }
});

function enableModule(status) {
  $httpAPI("POST", "v1/modules", { [name]: status }, () => $done());
}