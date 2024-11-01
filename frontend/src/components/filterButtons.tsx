import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"

export default function FilterButtons() {
    const { theme } = useSelector((state: ReduxState) => state.theme)

    // Categories filter
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Categories list
    const categories = ["Kind", "Bold", "NTNU"];

    // Function to toggle category selection
    function toggleCategory(category: string) {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(cat => cat !== category)
                : [...prev, category]
        );
    }

    return (
        <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 16,
            width: '50%',
        }}>
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
