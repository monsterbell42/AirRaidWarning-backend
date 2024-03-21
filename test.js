async function hello() {
    setInterval(() => console.error('hello'), 5000)
}

(async () => {
    await hello().catch(err=>console.log(err))
})()