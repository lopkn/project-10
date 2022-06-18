class Cache {
  get_cache() {
    if (this.cache == undefined) {
      this.cache = {}
    }
    return this.cache
  }

  set_value(key, value) {
  }
}

function test() {
    let x = 1
    debugger
  let cache = new Cache()
  console.log("can create cache")
  cache.get_cache()

  console.log("can store value to  cache")
  let value = cache.set_value("a", 123)
}

test()
