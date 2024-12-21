import { StyleSheet } from "react-native";
import { colors, fontFamily } from "@/styles/theme"

export const s = StyleSheet.create({
    container: {
       paddingHorizontal: 32
    },

    title: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
        color: colors.gray[500],
        marginBottom: 12
    },
    
    content: {
        flexDirection: "row",
        backgroundColor: colors.green.soft,
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 8,
        alignItems: "center",
        gap: 10
    },
    code: {
        color: colors.gray[600],
        fontSize: 16,
        fontFamily: fontFamily.semiBold,
        textTransform: "uppercase"
    }
})