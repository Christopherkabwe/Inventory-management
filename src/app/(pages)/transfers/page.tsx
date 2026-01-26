import RedirectPage from "@/components/redirect/RedirectPage";

export default function HomePage() {
    return (
        <RedirectPage
            message="Welcome! Choose where you want to go:"
            links={[
                { label: "Go to Create Transfer", href: "/transfers/create-transfer" },
                { label: "Go to Manage Transfers", href: "/transfers/manage-transfers" },
                { label: "Go to Transfers Data", href: "/transfers/transfer-data" },
                { label: "Dashboard", href: "/" },
            ]}
        />
    );
}
