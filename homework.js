// ========================================
// 第六週作業：電商 API 資料串接練習
// 執行方式：node homework.js
// 環境需求：Node.js 18+（內建 fetch）
// ========================================

// 載入環境變數
require("dotenv").config({ path: ".env" });

// API 設定（從 .env 讀取）
const API_PATH = process.env.API_PATH;
const BASE_URL = "https://livejs-api.hexschool.io";
const ADMIN_TOKEN = process.env.API_KEY;

// ========================================
// 任務一：基礎 fetch 練習
// ========================================

/**
 * 1. 取得產品列表
 * 使用 fetch 發送 GET 請求
 * @returns {Promise<Array>} - 回傳 products 陣列
 */
async function getProducts() {
	// 請實作此函式
	// 提示：
	// 1. 使用 fetch() 發送 GET 請求
	// 2. 使用 response.json() 解析回應
	// 3. 回傳 data.products
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`);
	const data = await response.json();
	return data.products;
}

/**
 * 2. 取得購物車列表
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function getCart() {
	// 請實作此函式
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`);
	const data = await response.json();
	return data;
}

/**
 * 3. 錯誤處理：當 API 回傳錯誤時，回傳錯誤訊息
 * @returns {Promise<Object>} - 回傳 { success: boolean, data?: [...], error?: string }
 */
async function getProductsSafe() {
	// 請實作此函式
	// 提示：
	// 1. 加上 try-catch 處理錯誤
	// 2. 檢查 response.ok 判斷是否成功
	// 3. 成功回傳 { success: true, data: [...] }
	// 4. 失敗回傳 { success: false, error: '錯誤訊息' }
	try {
		const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return { success: true, data: data.products };
	} catch (error) {
		return { success: false, error: error.message };
	}
}

// ========================================
// 任務二：POST 請求 - 購物車操作
// ========================================

/**
 * 1. 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function addToCart(productId, quantity) {
	// 請實作此函式
	// 提示：
	// 1. 發送 POST 請求
	// 2. body 格式：{ data: { productId: "xxx", quantity: 1 } }
	// 3. 記得設定 headers: { 'Content-Type': 'application/json' }
	// 4. body 要用 JSON.stringify() 轉換
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			data: {
				productId: productId,
				quantity: quantity
			}
		})
	});
	const data = await response.json();
	return data;
}

/**
 * 2. 編輯購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function updateCartItem(cartId, quantity) {
	// 請實作此函式
	// 提示：
	// 1. 發送 PATCH 請求
	// 2. body 格式：{ data: { id: "購物車ID", quantity: 數量 } }
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, {
		method: "PATCH",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			data: {
				id: cartId,
				quantity: quantity
			}
		})
	});
	const data = await response.json();
	return data;
}

/**
 * 3. 刪除購物車特定商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function removeCartItem(cartId) {
	// 請實作此函式
	// 提示：發送 DELETE 請求到 /carts/{id}
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts/${cartId}`, {
		method: "DELETE"
	});
	const data = await response.json();
	return data;
}

/**
 * 4. 清空購物車
 * @returns {Promise<Object>} - 回傳清空後的購物車資料
 */
async function clearCart() {
	// 請實作此函式
	// 提示：發送 DELETE 請求到 /carts
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, {
		method: "DELETE"
	});
	const data = await response.json();
	return data;	
}

// ========================================
// HTTP 知識測驗 (額外練習)
// ========================================

/*
請回答以下問題（可以寫在這裡或另外繳交）：

1. HTTP 狀態碼的分類（1xx, 2xx, 3xx, 4xx, 5xx 各代表什麼）
   答：1xx 表示資訊性狀態碼，請稍等，伺服器收到請求，正處理中
   2xx 表示成功，沒問題，200 OK 表示成功，201 Created 表示已建立，204 No Content 表示無內容
   3xx 表示重定向，往這邊走，原網址換了，301 Moved Permanently 表示永久移動，302 Found 表示暫時移動
   4xx 表示客戶端錯誤，你搞錯地方了，404 Not Found 表示找不到資源，400 Bad Request 表示請求錯誤，401 Unauthorized 表示未授權
   5xx 表示伺服器錯誤，電腦搞砸了，伺服器當機或程式邏輯出錯，500 Internal Server Error 表示內部伺服器錯誤，503 Service Unavailable 表示服務不可用

2. GET、POST、PATCH、PUT、DELETE 的差異
   答：GET 用於取得資源，讀取
   POST 用於建立新資源，新增
   PATCH 用於更新部分資源，修改
   PUT 用於更新完整資源，替換
   DELETE 用於刪除資源，刪除

3. 什麼是 RESTful API？
   答：RESTful API 是一種標準化設計，遵循 REST（Representational State Transfer）設計原則的 API，
   它使用標準的 HTTP 方法（GET、POST、PATCH、PUT、DELETE）來操作資源，並通過 URL 來識別資源。
   EX：GET /posts 取得文章列表
	   POST /posts 新增文章
	   GET /posts/1 取得 ID 為 1 的文章
	   PATCH /posts/1 更新 ID 為 1 的文章
	   DELETE /posts/1 刪除 ID 為 1 的文章

*/

// ========================================
// 匯出函式供測試使用
// ========================================
module.exports = {
	API_PATH,
	BASE_URL,
	ADMIN_TOKEN,
	getProducts,
	getCart,
	getProductsSafe,
	addToCart,
	updateCartItem,
	removeCartItem,
	clearCart,
};

// ========================================
// 直接執行測試
// ========================================
if (require.main === module) {
	async function runTests() {
		console.log("=== 第六週作業測試 ===\n");
		console.log("API_PATH:", API_PATH);
		console.log("");

		if (!API_PATH) {
			console.log("請先在 .env 檔案中設定 API_PATH！");
			return;
		}

		// 任務一測試
		console.log("--- 任務一：基礎 fetch ---");
		try {
			const products = await getProducts();
			console.log(
				"getProducts:",
				products ? `成功取得 ${products.length} 筆產品` : "回傳 undefined",
			);
		} catch (error) {
			console.log("getProducts 錯誤:", error.message);
		}

		try {
			const cart = await getCart();
			console.log(
				"getCart:",
				cart ? `購物車有 ${cart.carts?.length || 0} 筆商品` : "回傳 undefined",
			);
		} catch (error) {
			console.log("getCart 錯誤:", error.message);
		}

		try {
			const result = await getProductsSafe();
			console.log(
				"getProductsSafe:",
				result?.success ? "成功" : result?.error || "回傳 undefined",
			);
		} catch (error) {
			console.log("getProductsSafe 錯誤:", error.message);
		}

		console.log("\n=== 測試結束 ===");
		console.log("\n提示：執行 node test.js 進行完整驗證");
	}

	runTests();
}
