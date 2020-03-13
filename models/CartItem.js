class CartItem{
    constructor(quantity, productPrice, productTitle, sum,imgUrl) {
        this.quantity = quantity;
        this.productPrice = productPrice;
        this.productTitle = productTitle;
        this.sum = sum;
        this.imgUrl=imgUrl;
      }
}
export default CartItem;