export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, details, img) {
    const like = { id, title, details, img };
    this.likes.push(like);

    //adding data to local storage
    this.persistData();
    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(el => el.id === id);
    this.likes.splice(index, 1);
    this.persistData();
  }


  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1;
  }
  getNumLike() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem('likes'));
    if (storage) this.likes = storage;
  }
}