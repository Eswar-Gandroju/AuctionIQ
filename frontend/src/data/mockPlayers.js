export const players = [
  {
    player_id: "P001", // Needed for Requirement #1 to filter Player 2
    player_name: "Virat Kohli",
    country: "India",
    role: "Batter",
    player_type: "Anchor",
    batting_position: "Toporder",
    batting_style: "RHB",
    impact_score: 0.91,
    consistency_index: 3.75,
    recent_form_score: 0.69,
    rule_score: 0.88, // Custom metric for your Radar Chart
    pred_score: 0.92, // Logic: Suitability bar = pred_score * 100
    base_price_in_lakhs: 200
  },
  {
    player_id: "P002",
    player_name: "Suryakumar Yadav",
    country: "India",
    role: "Batter",
    player_type: "Power Hitter",
    batting_position: "Middleorder",
    batting_style: "RHB",
    impact_score: 0.98,
    consistency_index: 3.85,
    recent_form_score: 0.72,
    rule_score: 0.95,
    pred_score: 0.96,
    base_price_in_lakhs: 200
  },
  {
    player_id: "P003",
    player_name: "Glenn Maxwell",
    country: "Australia",
    role: "All-rounder",
    player_type: "Finisher",
    batting_position: "Middleorder",
    batting_style: "RHB",
    impact_score: 0.85,
    consistency_index: 2.95,
    recent_form_score: 0.65,
    rule_score: 0.80,
    pred_score: 0.84,
    base_price_in_lakhs: 150
  }
];