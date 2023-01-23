teams = [
    {id:1, name: 'John'},
    {id:2, name: 'Carl'},
    {id:3, name: 'Sagan'},
    {id:4, name: 'Mars'}
]

ids = [2,3]

let listaFinal = []

ids.forEach ( (id) => {

    teams = teams.filter( team => {
        return (
            team.id != id
        )
    })


})

console.log(teams)
