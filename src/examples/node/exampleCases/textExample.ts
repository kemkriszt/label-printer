import { labels } from "@/index"

export default async (): Promise<labels.Label> => {
    const label = new labels.Label(60, 60)
    
    const textX = 10
    const textWidth = 250 

    const line1 = new labels.Line({x: textX - 1, y: 10}, {x: textX - 1, y: 100})
    const line2 = new labels.Line({x: textX + textWidth + 1, y: 10}, {x: textX + textWidth + 1, y: 100})

    const textContent = "Zutaten:  <b>Weizenmehl</b> (Gluten), Margarine (pflanzliche Öle, Rapsöl, <br/>teilweise gehärtetes Palmöl), raffiniertes, gebleichtes und desodoriertes Palmöl, Antioxidationsmittel <s>BHA (E320) und BHT</s> (E321) mit maximal 100 ppm   Eier, Salz, Hefe, Joghurt (Laktose), Käse (Laktose), Samen: Leinsamen, Sesam, Mohn, Kreuzkümmel. Brennwert pro 100 g: 1930,25 kJ/461,12 kcal; Fett 16,32 g, davon gesättigte Fettsäuren 7,56 g; Kohlenhydrate 59,78 g; Ballaststoffe 4,02 g; Eiweiß 9,25 g; Salz 0,5 g. Trocken und kühl lagern, bei +4 °C bis +20 °C. Mindestens haltbar bis: 20.11.2026"

    const text1 = new labels.Text(textContent, textX, 10)
    text1.setFont({ name: "default", size: 6 })
    text1.setMultiLine(textWidth)

    const text2 = new labels.Text(textContent, textX, 30)
    text2.setFont({ name: "default", size: 10 })
    text2.setMultiLine(textWidth)

    const text3 = new labels.Text(textContent, textX, 50)
    text3.setFont({ name: "default", size: 12 })
    text3.setMultiLine(textWidth)

    label.add(line1, line2, text1, text2, text3)

    return label
}
