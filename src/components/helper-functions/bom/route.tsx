function BOMTree({ components }: { components: BOMItem[] }) {
  return (
    <ul className="pl-4" >
      {
        components.map((c) => (
          <li key={c.id} >
            {c.component.name} - {c.quantity} {c.unit}
            {c.subComponents && <BOMTree components={c.subComponents} />}
          </li>
        ))
      }
    </ul>
  );
}
