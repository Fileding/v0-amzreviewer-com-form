// 运行订单CRUD测试
import("./test-orders-crud.js")
  .then(() => {
    console.log("测试完成")
  })
  .catch((error) => {
    console.error("测试失败:", error)
  })
