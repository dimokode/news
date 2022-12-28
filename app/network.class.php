<?

class Network {

	public function getServerResponseCode( $params ){
        $params = json_decode($params, true);
        $url = $params['url'];
		//$url = urldecode($url);
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_NOBODY, 1);
		curl_setopt($ch, CURLOPT_HEADER, 1);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_exec($ch);
		$info = curl_getinfo($ch);
		//Utils::wrlog(print_r($info, true));
		//return $info['http_code'];
        return $info;

	}


	static public function getPageContent( $url ){
		try{
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36");
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
			curl_setopt($ch, CURLOPT_COOKIEJAR, ROOT_DIR . '/cookie.txt');
			curl_setopt($ch, CURLOPT_COOKIEFILE, ROOT_DIR. '/cookie.txt');
			curl_setopt($ch, CURLOPT_NOBODY, 0);
			curl_setopt($ch, CURLOPT_HEADER, 0);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
			curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
			curl_setopt($ch, CURLOPT_TIMEOUT_MS, 6000);
			$content = curl_exec($ch);
			$info = curl_getinfo($ch);
			$curl_errno = curl_errno($ch);
			$curl_error = curl_error($ch);
			
			//errlog($info);
			if($info['http_code'] == 520){
				throw new Exception("CURL 520 Unknown error");
			}
			//errlog($curl_errno);
			//errlog($curl_error);

			curl_close($ch);
			if($content){
				return $content;
			}else{
				throw new Exception($curl_error);
			}
			
		}catch(Exception $e){
			//wrlog($e);
			throw $e;
		}

	}
	
	
	
		static public function getPageByUrl( $url ){

		try{
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36");
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
			//curl_setopt($ch, CURLOPT_MAXREDIRS , 100);
			curl_setopt($ch, CURLOPT_COOKIEJAR, ROOT_DIR . '/cookie.txt');
			curl_setopt($ch, CURLOPT_COOKIEFILE, ROOT_DIR. '/cookie.txt');
			//curl_setopt($ch, CURLOPT_NOBODY, 0);
			//curl_setopt($ch, CURLOPT_HEADER, 0);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
			$html = curl_exec($ch);
			$info = curl_getinfo($ch);
			$curl_errno = curl_errno($ch);
			$curl_error = curl_error($ch);

			//wrlog($html, 'curl.log');
			//wrlog($info, 'curl.log');
			//wrlog($curl_errno, 'curl.log');
			//wrlog($curl_error, 'curl.log');

			if($html){
				$ans['success'] = true;
				$ans['content'] = $html;
			}else{
				throw new Exception("$curl_errno : $curl_error");
				//$ans['success'] = false;
				//$ans['error'] = "$curl_errno : $curl_errno";
			}
			/*
			return [
				'success' => true,
				'info' => $info,
				'html' => $html,
				'curl_errno' => $curl_errno,
				'curl_error' => $curl_error,
			];
			*/
		}catch(Exception $e){
			$ans['success'] = false;
			$ans['error'] = $e->getMessage();
			errlog($ans['error']);
			//return $e->getMessage();
		}

		return $ans;

	}


	public function getJson( $params){
        $params = json_decode($params, true);
        $url = $params['url'];
		wrlog($url, 'curl.txt');
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		//curl_setopt($ch, CURLOPT_PORT, 7999);
		//curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8', 'Accept: application/json'));
		curl_setopt($ch, CURLOPT_HTTPHEADER, array("'content-type': 'application/json'"));
		curl_setopt($ch, CURLOPT_HEADER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, 1);
		//curl_setopt($ch, CURLOPT_POSTFIELDS, '{"Hello" : "World", "Foo": "World"}');
		curl_setopt($ch, CURLOPT_POSTFIELDS, '{"method": {"var1": "sometext", "var2": 4}}');
		//curl_setopt($ch, CURLOPT_POSTFIELDS, "{'method': {'var1': 'sometext', 'var2': 4}}");
		// Set timeout to close connection. Just for not waiting long.
		// curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		$curl_res = curl_exec($ch);
		if(!$curl_res){
			if($errno = curl_errno($ch)) {
				$error_message = curl_strerror($errno);
				return "cURL error ({$errno}):\n {$error_message}";
			}
		}
		return $curl_res;
		//return 1;
		
	}
}


?>