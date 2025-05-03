import { Text, View, StyleSheet } from 'react-native';


export const MonthSummary = () => {
    return (
        <View style={styles.noContainer}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                This feature is not available yet.
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                Please check back later.
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                Thank you for your patience!
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                If you have any questions, please contact us.
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                We are working hard to bring you this feature.
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                Stay tuned for updates!
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                We appreciate your support!
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                Thank you for using our app!
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                We hope you have a great day!
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                If you have any feedback, please let us know.
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                We are always looking to improve our app.
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                Thank you for your understanding!
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                We appreciate your feedback!
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                We are here to help you!
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                If you have any suggestions, please let us know.
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                We are always looking to improve our app.
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
                Thank you for your support!
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    noContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
});