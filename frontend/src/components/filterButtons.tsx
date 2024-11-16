import { setFilters } from "@redux/game"
import { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"

export default function FilterButtons({gameID}: {gameID?: string}) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const dispatch = useDispatch()
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const categories = ["Kind", "Bold", "NTNU"]

    // Function to toggle category selection
    function toggleCategory(category: string) {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(cat => cat !== category)
                : [...prev, category]
        )
    }

    useEffect(() => {
        if (gameID) {
            dispatch(setFilters(selectedCategories))
        }
    }, [selectedCategories])

    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '50%' }}>
            {categories.map(category => (
                <TouchableOpacity
                    key={category}
                    style={{
                        padding: 8,
                        margin: 4,
                        borderWidth: 1,
                        borderRadius: 4,
                        backgroundColor: selectedCategories.includes(category) 
                            ? theme.contrast 
                            : undefined
                    }}
                    onPress={() => toggleCategory(category)}
                >
                    <Text style={{ color: theme.textColor }}>{category}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}
