import PlayerList from "@components/playerList"
import SmallButton from "@components/smallButtons"
import { setGame } from "@redux/game"
import { createLobby, joinLobby } from "@utils/lobby"
import { useDispatch, useSelector } from "react-redux"

type CreateLobbyProps = {
    roundStarted: boolean
    startRound: () => void
}

export default function CreateLobby({roundStarted, startRound}: CreateLobbyProps) {
    const { gameID } = useSelector((state: ReduxState) => state.game)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { name } = useSelector((state: ReduxState) => state.name)
    const dispatch = useDispatch()

    // Start the game when the component mounts
    async function startGame() {
        const id = await createLobby()

        if (id) {
            dispatch(setGame(id))
            joinLobby(id, name)
        }
    }

    if (roundStarted) {
        return <></>
    }

    return (
        <>
            {!gameID && <SmallButton
                handler={startGame} 
                text={lang ? "Lag en lobby" : "Create a lobby"} 
            />}
            <PlayerList gameID={gameID} />
            {gameID && <SmallButton 
                handler={startRound} 
                text={lang ? "Start" : "Start"} 
            />}
        </>
    )
}