import { createStyles, Navbar, ScrollArea, Select, SimpleGrid } from "@mantine/core";
import { useEffect, useState } from "react";
import { FurnitureItem } from "./FurnitureItem";
import { useFurnitureStore } from "../../../stores/FurnitureStore";
const useStyles = createStyles((theme) => ({
    mb: {
        marginTop: theme.spacing.xs,
        marginBottom: theme.spacing.xs
    }
}));

export function FurnitureAddPanel() {
    const { classes } = useStyles();
    const [category, setCategory] = useState('');
    const [availableCategories, setAvailableCategories] = useState([]);
    const { categories, currentFurnitureData, getCurrentFurnitureData } = useFurnitureStore();
    const [cards, setCards] = useState([]);

    // when a category is selected by user, load its furniture elements from API
    useEffect(() => {
        if (category) {
            getCurrentFurnitureData(category)
        }
    }, [category])

    // when furniture data is loaded from API, create cards and display to user
    useEffect(() => {
        setCards(currentFurnitureData.map((item) =>
        (
            <FurnitureItem data={item} key={item._id}></FurnitureItem>
        )
        ))
    }, [currentFurnitureData])

    // on first load, select default category
    useEffect(() => {
        setCategory(categories[0]._id)
    }, [categories])

    return (<>
        <Navbar.Section>
            <Select className={classes.mb} value={category} onChange={setCategory} data={categories.map(cat => {
                return { value: cat._id, label: cat.name };
            })} />
        </Navbar.Section>
        <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
            <SimpleGrid style={{ padding: 5 }} cols={2}>
                {cards}
            </SimpleGrid>
        </Navbar.Section>
    </>)
}
