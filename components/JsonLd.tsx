interface JsonLdProps {
    data: object | object[];
}

/** Renders one or more Schema.org JSON-LD blocks. */
export function JsonLd({ data }: JsonLdProps) {
    const items = Array.isArray(data) ? data : [data];
    return (
        <>
            {items.map((d, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
                />
            ))}
        </>
    );
}
