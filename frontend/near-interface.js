export class Contract {
  wallet;

  constructor({ wallet }) {
    this.wallet = wallet
  }
 
  async getAllPosts() {
     return await this.wallet.viewMethod({ method: "getAllPosts" })
  }

  async createPost(title, description, title, media) {
    return await this.wallet.viewMethod({ method: "createPost", 
      args: {
        title, description, title, media
      }
    })
  }
}