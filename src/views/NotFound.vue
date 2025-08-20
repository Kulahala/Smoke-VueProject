<template>
  <div class="not-found-container">
    <h1>404</h1>
    <p>抱歉，您要找的页面不存在。</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<style scoped>
.not-found-container {
  text-align: center;
  padding: 80px 20px;
}
.not-found-container h1 {
  font-size: 6em;
  margin: 0;
  color: #666;
}
.not-found-container p {
  font-size: 1.5em;
  color: #888;
}
.not-found-container a {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.not-found-container a:hover {
  background-color: #0056b3;
}
</style>
