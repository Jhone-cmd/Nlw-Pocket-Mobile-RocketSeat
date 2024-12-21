
import { View, Text, Alert } from "react-native";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { Categories, CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/places/place";
import { Places } from "@/components/places";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { colors, fontFamily } from "@/styles/theme"
import { router } from "expo-router";

const currentLocation = {
    latitude: -23.561187293883442,
    longitude: -46.656451388116494
}

type MarketsProps = PlaceProps & {
    latitude: number,
    longitude: number
}

export default function Home() {
    const [categories, setCategories] = useState<CategoriesProps>([])
    const [category, setCategory] = useState("")
    const [markets, setMarkets] = useState<MarketsProps[]>([])
    const [location, setLocation] = useState<Location.LocationObject>()

    async function fetchCategories() {
        try {
            const { data } = await api.get('/categories');
            setCategories(data)
            setCategory(data[0].id)
        } catch (error) {
            Alert.alert("Categorias", "Não foi possível carregar as categorias")
        }
    }

    async function fetchMarkets() {
        try {

            if (!category) {
                return
            }

            const { data } = await api.get('/markets/category/' + category);
            setMarkets(data)

        } catch (error) {
            Alert.alert("Locais", "Não foi possível carregar as locais")
        }
    }

    
    async function getCurrentLocation() {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync()

            if (granted) {
                let location = await Location.getCurrentPositionAsync()
                setLocation(location)               
            }

        } catch (error) {
            console.log(error);                
        }
    }


    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        fetchMarkets()
    }, [category])

    return (
        <View style={{ flex: 1 }}>
            <Categories 
                data={categories} 
                selected={category} 
                onSelect={setCategory} 
            />

            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
                }}
            >
                <Marker
                identifier="current"
                coordinate={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                }}
                image={require("@/assets/location.png")}
                />

                {markets.map((item) => (
                    <Marker
                        key={item.id}
                        identifier={item.id}
                        coordinate={{
                        latitude: item.latitude,
                        longitude: item.longitude,
                        }}
                        image={require("@/assets/pin.png")}
                    >
                        <Callout onPress={() => router.navigate(`/market/${item.id}`)}>
                        <View  style={{ width: 160, height: "100%", paddingHorizontal: 16,
                        paddingVertical: 16,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderRadius: 16,
                        justifyContent: "center", }}>
                            <Text
                            style={{
                                fontSize: 14,
                                color: colors.gray[600],
                                fontFamily: fontFamily.medium,
                            }}
                            >
                            {item.name}
                            </Text>

                            <Text
                            style={{
                                fontSize: 12,
                                color: colors.gray[600],
                                fontFamily: fontFamily.regular,
                            }}
                            >
                            {item.address}
                            </Text>
                        </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            <Places data={markets}/>
        </View>
    )
}