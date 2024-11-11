// Imports all hearts
import hearts_2 from "@assets/images/cards/2_of_hearts.svg"
import hearts_3 from "@assets/images/cards/3_of_hearts.svg"
import hearts_4 from "@assets/images/cards/4_of_hearts.svg"
import hearts_5 from "@assets/images/cards/5_of_hearts.svg"
import hearts_6 from "@assets/images/cards/6_of_hearts.svg"
import hearts_7 from "@assets/images/cards/7_of_hearts.svg"
import hearts_8 from "@assets/images/cards/8_of_hearts.svg"
import hearts_9 from "@assets/images/cards/9_of_hearts.svg"
import hearts_10 from "@assets/images/cards/10_of_hearts.svg"
import hearts_11 from "@assets/images/cards/jack_of_hearts.svg"
import hearts_12 from "@assets/images/cards/queen_of_hearts.svg"
import hearts_13 from "@assets/images/cards/king_of_hearts.svg"
import hearts_14 from "@assets/images/cards/ace_of_hearts.svg"

// Imports all clubs
import clubs_2 from "@assets/images/cards/2_of_clubs.svg"
import clubs_3 from "@assets/images/cards/3_of_clubs.svg"
import clubs_4 from "@assets/images/cards/4_of_clubs.svg"
import clubs_5 from "@assets/images/cards/5_of_clubs.svg"
import clubs_6 from "@assets/images/cards/6_of_clubs.svg"
import clubs_7 from "@assets/images/cards/7_of_clubs.svg"
import clubs_8 from "@assets/images/cards/8_of_clubs.svg"
import clubs_9 from "@assets/images/cards/9_of_clubs.svg"
import clubs_10 from "@assets/images/cards/10_of_clubs.svg"
import clubs_11 from "@assets/images/cards/jack_of_clubs.svg"
import clubs_12 from "@assets/images/cards/queen_of_clubs.svg"
import clubs_13 from "@assets/images/cards/king_of_clubs.svg"
import clubs_14 from "@assets/images/cards/ace_of_clubs.svg"

// Imports all diamonds
import diamonds_2 from "@assets/images/cards/2_of_diamonds.svg"
import diamonds_3 from "@assets/images/cards/3_of_diamonds.svg"
import diamonds_4 from "@assets/images/cards/4_of_diamonds.svg"
import diamonds_5 from "@assets/images/cards/5_of_diamonds.svg"
import diamonds_6 from "@assets/images/cards/6_of_diamonds.svg"
import diamonds_7 from "@assets/images/cards/7_of_diamonds.svg"
import diamonds_8 from "@assets/images/cards/8_of_diamonds.svg"
import diamonds_9 from "@assets/images/cards/9_of_diamonds.svg"
import diamonds_10 from "@assets/images/cards/10_of_diamonds.svg"
import diamonds_11 from "@assets/images/cards/jack_of_diamonds.svg"
import diamonds_12 from "@assets/images/cards/queen_of_diamonds.svg"
import diamonds_13 from "@assets/images/cards/king_of_diamonds.svg"
import diamonds_14 from "@assets/images/cards/ace_of_diamonds.svg"

// Imports all spades
import spades_2 from "@assets/images/cards/2_of_spades.svg"
import spades_3 from "@assets/images/cards/3_of_spades.svg"
import spades_4 from "@assets/images/cards/4_of_spades.svg"
import spades_5 from "@assets/images/cards/5_of_spades.svg"
import spades_6 from "@assets/images/cards/6_of_spades.svg"
import spades_7 from "@assets/images/cards/7_of_spades.svg"
import spades_8 from "@assets/images/cards/8_of_spades.svg"
import spades_9 from "@assets/images/cards/9_of_spades.svg"
import spades_10 from "@assets/images/cards/10_of_spades.svg"
import spades_11 from "@assets/images/cards/jack_of_spades.svg"
import spades_12 from "@assets/images/cards/queen_of_spades.svg"
import spades_13 from "@assets/images/cards/king_of_spades.svg"
import spades_14 from "@assets/images/cards/ace_of_spades.svg"

import { SvgXml } from "react-native-svg"
import { StyleProp, TextStyle } from "react-native"

// Stores all hearts
const hearts = [
    hearts_2,
    hearts_3,
    hearts_4,
    hearts_5,
    hearts_6,
    hearts_7,
    hearts_8,
    hearts_9,
    hearts_10,
    hearts_11,
    hearts_12,
    hearts_13,
    hearts_14,
] as string[]

// Stores all clubs
const clubs = [
    clubs_2,
    clubs_3,
    clubs_4,
    clubs_5,
    clubs_6,
    clubs_7,
    clubs_8,
    clubs_9,
    clubs_10,
    clubs_11,
    clubs_12,
    clubs_13,
    clubs_14,
] as string[]

// Stores all diamonds
const diamonds = [
    diamonds_2,
    diamonds_3,
    diamonds_4,
    diamonds_5,
    diamonds_6,
    diamonds_7,
    diamonds_8,
    diamonds_9,
    diamonds_10,
    diamonds_11,
    diamonds_12,
    diamonds_13,
    diamonds_14,
] as string[]

// Stores all spades
const spades = [
    spades_2,
    spades_3,
    spades_4,
    spades_5,
    spades_6,
    spades_7,
    spades_8,
    spades_9,
    spades_10,
    spades_11,
    spades_12,
    spades_13,
    spades_14,
] as string[]

// Joins all types together in two dimensional array
const cards = [hearts, clubs, diamonds, spades] as string[][]

// Props for the card, all optional
type CardProps = {
    number: OneToFourteen
    type: CardType
    style?: StyleProp<TextStyle>
}

type RandomCardProps = {
    type: CardType
    number: OneToFourteen
}

/**
 * Renders a card of specific or random type and value.
 * 
 * @param style Custom style object to style the card 
 * @param number Specific card number to display
 * @param style Specific card type to display
 * @returns The element to be displayed, and info about what card and type is being displayed
 */
export default function Card({style, number, type}: CardProps) {
    // Lookup table for type -> number
    const typeToNumber = { hearts: 0, clubs: 1, diamonds: 2, spades: 3 } as {[key: string]: number}

    // Stores the type to be displayed
    const Type = typeToNumber[type as string]

    // Displays the card
    return <SvgXml xml={cards[Type][number - 2]} style={style} />
}

export function getRandomCard(): RandomCardProps {
    // Random number between 2 - 14
    const randomNumber = (Math.floor((Math.random() * 100) % 13) + 2) as OneToFourteen

    // Random number between 0 - 3
    const randomType = Math.floor((Math.random() * 100) % 4)

    // 'Lookup table' for number -> type
    const numberToType = ['hearts', 'spades', 'clubs', 'diamonds']

    // Stores the type to be displayed
    const Type = randomType

    // Returns the card and info
    return { type: numberToType[Type] as CardType, number: randomNumber }
}
