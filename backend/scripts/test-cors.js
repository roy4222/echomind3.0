/**
 * CORS 測試腳本
 * 用於檢查 Cloudflare Worker API 是否正確配置 CORS
 */

// 測試端點
const API_BASE_URL = 'https://echomind-api.roy422roy.workers.dev';
const TEST_ENDPOINTS = [
  '/api/health',
  '/api/vector-search'
];

// 測試選項請求
async function testOptionsRequest(endpoint) {
  console.log(`\n測試 OPTIONS 請求: ${endpoint}`);
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('狀態:', response.status);
    
    // 檢查 CORS 頭
    const corsHeaders = [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers',
      'Access-Control-Max-Age'
    ];
    
    corsHeaders.forEach(header => {
      console.log(`${header}: ${response.headers.get(header)}`);
    });
    
    return response.status === 204 || response.status === 200;
  } catch (error) {
    console.error('測試失敗:', error.message);
    return false;
  }
}

// 測試實際請求
async function testRequest(endpoint, method = 'GET', body = null) {
  console.log(`\n測試 ${method} 請求: ${endpoint}`);
  try {
    const fetchOptions = {
      method,
      headers: {
        'Origin': 'http://localhost:3000',
        'Content-Type': 'application/json'
      }
    };
    
    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    
    console.log('狀態:', response.status);
    
    // 檢查 CORS 頭
    const corsHeaders = [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers'
    ];
    
    corsHeaders.forEach(header => {
      console.log(`${header}: ${response.headers.get(header)}`);
    });
    
    // 輸出響應內容
    try {
      const data = await response.json();
      console.log('響應數據:', data);
    } catch (e) {
      console.log('無法解析響應為 JSON');
    }
    
    return response.ok;
  } catch (error) {
    console.error('測試失敗:', error.message);
    return false;
  }
}

// 主測試函數
async function runTests() {
  console.log('開始 CORS 測試...');
  let allPassed = true;
  
  // 測試所有端點的 OPTIONS 請求
  for (const endpoint of TEST_ENDPOINTS) {
    const optionsPassed = await testOptionsRequest(endpoint);
    allPassed = allPassed && optionsPassed;
    console.log(`OPTIONS 測試 ${endpoint}: ${optionsPassed ? '通過 ✅' : '失敗 ❌'}`);
  }
  
  // 測試 GET 健康檢查請求
  const healthPassed = await testRequest('/api/health');
  allPassed = allPassed && healthPassed;
  console.log(`健康檢查測試: ${healthPassed ? '通過 ✅' : '失敗 ❌'}`);
  
  // 測試 POST 向量搜索請求
  const vectorSearchBody = {
    query: '測試查詢',
    topK: 1
  };
  const vectorSearchPassed = await testRequest('/api/vector-search', 'POST', vectorSearchBody);
  allPassed = allPassed && vectorSearchPassed;
  console.log(`向量搜索測試: ${vectorSearchPassed ? '通過 ✅' : '失敗 ❌'}`);
  
  console.log(`\n測試結果: ${allPassed ? '全部通過 ✅' : '部分失敗 ❌'}`);
}

// 運行測試
runTests().catch(error => {
  console.error('測試運行錯誤:', error);
}); 