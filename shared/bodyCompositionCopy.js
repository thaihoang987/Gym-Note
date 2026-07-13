// Per-metric reference content for the body composition report page's detail popup: a static
// description of what the metric means, plus analysis/suggestion text that varies by grade tier
// (Under/Standard/Over/High... collapsed to the same 4 buckets `gradeColorTier` already uses:
// under/good/warning/danger). Modeled on the Xiaomi Mi Fit scale app's own per-metric detail
// screens, which pair each reading with this kind of explanation — this is original wording (not
// copied from Xiaomi's app text) written in the same reference-info tone, since only a few tiers
// were ever visible in the sample screenshots this was built from.
//
// Metrics with no grade on this report (body_age, fat_free_weight, and the four raw *_mass_kg
// values that mirror a percentage field) only get a `description`, matching how Xiaomi's own
// detail screen for those shows no colored range bar either.
import { gradeColorTier } from './bodyCompositionMetrics.js';

export const METRIC_DESCRIPTIONS = {
  en: {
    weight: 'Body weight is the total mass of your body. Tracked over time and combined with height (as BMI), it is one of the simplest indicators of overall body condition.',
    bmi: "Body Mass Index (BMI) is a person's weight in kilograms divided by the square of height in meters, which is closely related to body fat mass and is an important indicator of body fatness. BMI is commonly used internationally as one of the criteria for measuring the body fitness level of an individual.",
    body_fat: "Body fat percentage is the proportion of fat mass in the total body mass, which reflects the amount of fat in a person's body.",
    muscle_mass: 'Muscle is the largest tissue in the human body and plays a very important role in maintaining body temperature and movement, as well as maintaining heartbeat and generating heat. Muscle can be divided into three categories: skeletal, smooth, and cardiac muscle, of which skeletal muscle accounts for about 40% of body weight.',
    muscle_percent: 'Muscle percentage is the proportion of muscle to body weight, generally around 65%-90%.',
    body_water_percent: 'Body water percentage is the proportion of body water in the total body weight. Generally speaking, muscle tissue contains more body water than other parts of the body.',
    protein_percent: 'Protein percentage is the percentage of protein mass in total body weight.',
    bone_mineral_percent: 'Bone mineral percentage is the proportion of bone mineral mass to the total body mass.',
    skeletal_muscle: 'Skeletal muscles are attached to bones and provide energy for body movement. Muscle volume and weight directly determine the athletic ability of the body and play an important role in regulating energy metabolism.',
    visceral_fat: 'Visceral fat, as a type of fat in the human body, is essential to stabilize and protect internal organs. However, excessive visceral fat may increase the risk of cardiovascular disease and metabolic disease.',
    bmr: 'Basal metabolic rate is the energy your body uses per day at complete rest, just to keep vital functions running — breathing, circulation, and cell repair. It is the minimum number of calories you burn even if you stayed in bed all day.',
    waist_hip: "Waist-to-hip ratio mainly reflects the fat distribution in a person's body, obtained by dividing waist circumference by hip circumference. The estimated value here is calculated from other readings and is for reference only.",
    heart_rate: 'Heart rate is the number of times your heart beats per minute. A normal resting heart rate ranges from 60 to 100 bpm, and varies individually based on age, fitness level, and other factors.',
    body_age: 'Body age reflects physiological level, health, and vitality based on your body composition rather than your birth date. If it is higher than your actual age, your body composition (especially body fat percentage) may need attention.',
    fat_free_weight: 'Fat-free body weight, also known as lean body weight, is your weight excluding all body fat. It consists mainly of water, muscle, bone, and organs.',
    body_water_mass: 'The absolute mass of water in your body — the same underlying measurement as body water percentage, expressed in kg instead of as a share of total weight.',
    fat_mass: 'The absolute mass of fat in your body — the same underlying measurement as body fat percentage, expressed in kg instead of as a share of total weight.',
    bone_mineral_mass: 'The absolute mass of mineral content in your bones — the same underlying measurement as bone mineral percentage, expressed in kg instead of as a share of total weight.',
    protein_mass: 'The absolute mass of protein in your body — the same underlying measurement as protein percentage, expressed in kg instead of as a share of total weight.'
  },
  vi: {
    weight: 'Cân nặng là tổng khối lượng cơ thể bạn. Theo dõi theo thời gian và kết hợp với chiều cao (thành BMI), đây là một trong những chỉ số đơn giản nhất phản ánh tình trạng cơ thể tổng quát.',
    bmi: 'Chỉ số khối cơ thể (BMI) là cân nặng (kg) chia cho bình phương chiều cao (m), có liên quan chặt chẽ đến lượng mỡ cơ thể và là một chỉ số quan trọng để đánh giá mức độ béo. BMI thường được dùng trên toàn thế giới như một tiêu chí đánh giá thể trạng.',
    body_fat: 'Tỉ lệ mỡ cơ thể là phần trăm khối lượng mỡ trên tổng khối lượng cơ thể, phản ánh lượng mỡ tích trữ trong cơ thể một người.',
    muscle_mass: 'Cơ là mô lớn nhất trong cơ thể người, đóng vai trò quan trọng trong việc duy trì thân nhiệt và vận động, cũng như duy trì nhịp tim và sinh nhiệt. Cơ được chia thành 3 loại: cơ vân, cơ trơn và cơ tim, trong đó cơ vân (cơ xương) chiếm khoảng 40% trọng lượng cơ thể.',
    muscle_percent: 'Tỉ lệ cơ là tỉ lệ khối lượng cơ trên cân nặng cơ thể, thường dao động khoảng 65%-90%.',
    body_water_percent: 'Tỉ lệ nước cơ thể là tỉ lệ lượng nước trên tổng cân nặng. Thông thường, mô cơ chứa nhiều nước hơn các mô khác trong cơ thể.',
    protein_percent: 'Tỉ lệ protein là phần trăm khối lượng protein trên tổng cân nặng cơ thể.',
    bone_mineral_percent: 'Tỉ lệ khoáng xương là tỉ lệ khối lượng khoáng chất trong xương trên tổng khối lượng cơ thể.',
    skeletal_muscle: 'Cơ xương bám vào xương và cung cấp năng lượng cho vận động cơ thể. Khối lượng và thể tích cơ ảnh hưởng trực tiếp đến khả năng vận động và đóng vai trò quan trọng trong điều hòa trao đổi chất.',
    visceral_fat: 'Mỡ nội tạng là loại mỡ bao quanh và bảo vệ các cơ quan nội tạng. Tuy nhiên, mỡ nội tạng dư thừa có thể làm tăng nguy cơ bệnh tim mạch và rối loạn chuyển hóa.',
    bmr: 'Tỉ lệ trao đổi chất cơ bản là năng lượng cơ thể tiêu hao mỗi ngày khi hoàn toàn nghỉ ngơi, chỉ để duy trì các chức năng sống — hô hấp, tuần hoàn, tái tạo tế bào. Đây là lượng calo tối thiểu bạn đốt dù nằm yên cả ngày.',
    waist_hip: 'Tỉ lệ eo-hông chủ yếu phản ánh sự phân bố mỡ trên cơ thể, tính bằng vòng eo chia vòng hông. Giá trị ước tính này được tính từ các số liệu khác, chỉ mang tính tham khảo.',
    heart_rate: 'Nhịp tim là số lần tim đập mỗi phút. Nhịp tim nghỉ bình thường dao động 60-100 lần/phút, thay đổi tùy theo độ tuổi, thể trạng và nhiều yếu tố khác.',
    body_age: 'Tuổi cơ thể phản ánh mức độ sinh lý, sức khỏe và sự dẻo dai dựa trên thành phần cơ thể chứ không phải ngày sinh. Nếu cao hơn tuổi thật, thành phần cơ thể (đặc biệt là tỉ lệ mỡ) có thể cần được chú ý.',
    fat_free_weight: 'Cân nặng không mỡ (khối lượng nạc) là cân nặng cơ thể sau khi trừ hết mỡ, chủ yếu gồm nước, cơ, xương và nội tạng.',
    body_water_mass: 'Khối lượng nước tuyệt đối trong cơ thể — cùng một phép đo với tỉ lệ nước cơ thể, chỉ khác đơn vị là kg thay vì phần trăm.',
    fat_mass: 'Khối lượng mỡ tuyệt đối trong cơ thể — cùng một phép đo với tỉ lệ mỡ cơ thể, chỉ khác đơn vị là kg thay vì phần trăm.',
    bone_mineral_mass: 'Khối lượng khoáng chất tuyệt đối trong xương — cùng một phép đo với tỉ lệ khoáng xương, chỉ khác đơn vị là kg thay vì phần trăm.',
    protein_mass: 'Khối lượng protein tuyệt đối trong cơ thể — cùng một phép đo với tỉ lệ protein, chỉ khác đơn vị là kg thay vì phần trăm.'
  }
};

// ─────────────────────────────────────────────────────────────────────────────────────────────
// Analysis/suggestion text (the popup's "Analysis and suggestions" section).
//
// Unlike the old version of this file (one fixed sentence per metric per tier, matching what
// Xiaomi's own app shows), this needs to keep changing as the exact reading moves — even within
// the same tier — instead of jumping straight from "low" text to "normal" text at a single
// breakpoint. It also needs at least 50 distinct possible sentences per metric popup.
//
// Rather than hand-writing 50+ fully independent sentences per metric (which at this scale tends
// toward padding/repetition rather than real variety), each sentence is built from two parts:
//   - an OPENER: a short, tier-specific observation, generic across metrics (just fills in the
//     metric's display label), e.g. "{metric} is currently below the standard reference range."
//   - an ACTION: a metric-specific, actionable suggestion tailored to that exact metric+tier.
// `metricAnalysis` below picks a combination deterministically from the *exact* reading's position
// within its tier's numeric span, stepping through every combination in order as the value moves
// from the bottom to the top of that span — so a value 0.1 apart can land on a different sentence,
// while readings within the same small band get the same (tier-correct) advice. openers.length ×
// actions.length is sized to be well over 50 for every metric across its tiers combined.
const OPENERS = {
  en: {
    under: [
      '{metric} is currently below the standard reference range.',
      'Your {metric} reading came in lower than the recommended band.',
      '{metric} sits under the healthy baseline for this scan.',
      'This result shows {metric} falling short of the target range.',
      'Compared with the reference range, {metric} is on the low side.'
    ],
    good: [
      '{metric} is right within the standard reference range.',
      'Your {metric} reading falls comfortably inside the healthy band.',
      '{metric} looks well balanced for this scan.',
      'This result places {metric} right where it should be.',
      'Compared with the reference range, {metric} is right on target.'
    ],
    warning: [
      '{metric} is currently above the standard reference range.',
      'Your {metric} reading came in higher than the recommended band.',
      '{metric} sits above the healthy baseline for this scan.',
      'This result shows {metric} exceeding the target range.',
      'Compared with the reference range, {metric} is on the high side.'
    ],
    danger: [
      '{metric} is significantly above the standard reference range.',
      'Your {metric} reading is well outside the healthy band this time.',
      '{metric} sits far above the reference range for this scan.',
      'This result shows {metric} substantially exceeding the target range.',
      'Compared with the reference range, {metric} is markedly elevated.'
    ]
  },
  vi: {
    under: [
      '{metric} của bạn hiện đang thấp hơn mức chuẩn tham chiếu.',
      'Kết quả đo cho thấy {metric} thấp hơn dải khuyến nghị.',
      '{metric} đang nằm dưới ngưỡng lý tưởng ở lần đo này.',
      'So với dải tham chiếu, {metric} của bạn hơi thấp.',
      '{metric} chưa đạt tới mức chuẩn mong muốn.'
    ],
    good: [
      '{metric} của bạn đang nằm gọn trong dải chuẩn tham chiếu.',
      'Kết quả đo cho thấy {metric} ở mức cân đối, khỏe mạnh.',
      '{metric} đang ở đúng mức lý tưởng cho lần đo này.',
      'So với dải tham chiếu, {metric} của bạn đang rất ổn.',
      '{metric} đạt đúng mức khuyến nghị.'
    ],
    warning: [
      '{metric} của bạn hiện đang cao hơn mức chuẩn tham chiếu.',
      'Kết quả đo cho thấy {metric} cao hơn dải khuyến nghị.',
      '{metric} đang nằm trên ngưỡng lý tưởng ở lần đo này.',
      'So với dải tham chiếu, {metric} của bạn hơi cao.',
      '{metric} đã vượt mức chuẩn mong muốn.'
    ],
    danger: [
      '{metric} của bạn hiện cao hơn đáng kể so với mức chuẩn.',
      'Kết quả đo cho thấy {metric} lệch khá xa dải khuyến nghị.',
      '{metric} đang vượt xa ngưỡng lý tưởng ở lần đo này.',
      'So với dải tham chiếu, {metric} của bạn cao rõ rệt.',
      '{metric} đã vượt mức chuẩn ở mức đáng chú ý.'
    ]
  }
};

const ACTIONS = {
  en: {
    weight: {
      under: [
        'Add 300–500 kcal a day from nutrient-dense foods rather than empty calories.',
        'Include a protein-rich snack between meals — nuts, yogurt, or a protein shake work well.',
        'Pair the extra calories with light resistance training so the gain leans toward muscle, not just fat.',
        "If low weight persists for months despite eating more, it's worth a general health check-up."
      ],
      good: [
        "Keep your current eating pattern and activity level — whatever you're doing is working.",
        'Re-weigh under the same conditions (morning, similar clothing) to keep future comparisons accurate.',
        'Use this as your baseline and track weekly trends rather than reacting to single-day swings.',
        'Pair steady weight with a mix of strength and cardio to keep body composition balanced too.'
      ],
      warning: [
        'Aim for a modest calorie deficit of around 300–500 kcal a day rather than a drastic cut.',
        'Add 2–3 sessions a week of brisk cardio or strength training to support fat loss.',
        'Watch portion sizes and liquid calories (sugary drinks, alcohol) — these often go unnoticed.',
        'Track weight weekly instead of daily to smooth out water-retention noise.'
      ],
      danger: [
        'Consider speaking with a doctor or dietitian for a structured, personalized plan.',
        'Prioritize sustainable changes — a large deficit too fast can backfire and cause muscle loss.',
        'Screen for related risk factors like blood pressure and blood sugar alongside weight management.',
        'Set a first short-term target (e.g. 5% of current weight) rather than the whole journey at once.'
      ]
    },
    bmi: {
      under: [
        'Focus on calorie-dense whole foods like nuts, whole grains, and healthy oils to raise BMI gradually.',
        'Combine the extra intake with strength training to build lean mass rather than just body fat.',
        'Eat on a regular schedule — 3 meals plus 1–2 snacks — instead of skipping meals.',
        'If BMI stays low with no clear cause, a check-up can rule out absorption or thyroid issues.'
      ],
      good: [
        'Maintain your current eating and training habits — your BMI reflects a healthy balance right now.',
        "Keep an eye on waist circumference too, since BMI alone doesn't capture fat distribution.",
        'Continue regular physical activity to protect this healthy range as you age.',
        'Recheck every few weeks rather than daily — BMI barely moves day to day.'
      ],
      warning: [
        'Reduce daily calories by around 300–500 kcal and increase daily step count.',
        'Prioritize protein and fiber at each meal to stay fuller on fewer calories.',
        'Add 2–3 strength sessions weekly to protect muscle while BMI comes down.',
        "Cut back on refined carbs and sugary drinks, which add calories without much satiety."
      ],
      danger: [
        'A doctor or dietitian consult is worth it here for a safe, structured plan.',
        'Screen for related conditions like blood pressure, blood sugar, and cholesterol.',
        'Start with small, sustainable habit changes — total step count, sleep, and sugary drinks are good first targets.',
        'Set an initial goal of getting BMI into the next lower band rather than jumping straight to normal.'
      ]
    },
    body_fat: {
      under: [
        'Very low body fat can affect hormones — make sure total calorie intake is adequate.',
        'Include healthy fats (avocado, olive oil, nuts) rather than cutting fat intake too far.',
        'Pair resistance training with enough recovery so performance and hormones stay in balance.',
        "If body fat is very low alongside fatigue or irregular cycles, a doctor's check-up is worthwhile."
      ],
      good: [
        'This is a healthy, well-proportioned level — keep your current diet and training mix.',
        'Continue a mix of resistance and cardio training to maintain this balance long-term.',
        'Use this scan as a baseline and re-check every few weeks rather than daily.',
        'Focus next on performance or strength goals rather than further fat loss.'
      ],
      warning: [
        'Add 2–3 sessions of moderate-to-vigorous cardio per week alongside your current routine.',
        'Keep protein intake high while trimming calories, to protect muscle during fat loss.',
        "Watch added sugar and processed snacks first — they're usually the easiest calories to cut.",
        'Resistance training 2–3x/week helps preserve muscle while body fat comes down.'
      ],
      danger: [
        'A structured plan with a professional (dietitian or doctor) will get better, safer results here.',
        'Start with a moderate calorie deficit — very aggressive cuts often backfire long-term.',
        'Screen for related metabolic markers (blood sugar, cholesterol) alongside fat-loss efforts.',
        'Combine diet changes with regular movement (walking counts) rather than diet alone.'
      ]
    },
    muscle_mass: {
      under: [
        'Add 2–3 resistance training sessions per week, focusing on compound lifts (squat, press, row).',
        'Aim for roughly 1.6–2.2g of protein per kg of body weight to support muscle growth.',
        'Progressive overload matters more than workout length — gradually add weight or reps over time.',
        'Prioritize sleep (7–9 hours) since most muscle repair happens during recovery, not training.'
      ],
      good: [
        'Your muscle mass is well-developed — keep progressive resistance training in your routine.',
        'Maintain adequate protein intake spread across meals to support ongoing recovery.',
        'Vary rep ranges (strength, hypertrophy, endurance) periodically to keep progressing.',
        'This is a solid base — you can now focus on other goals like conditioning or mobility.'
      ],
      warning: [
        'Above-reference muscle mass is generally a good sign — keep your current training and nutrition.',
        'Make sure recovery keeps pace with training volume so gains stay sustainable.',
        'Continue balanced training that includes mobility and cardio, not just strength work.',
        'This level supports higher daily calorie needs — adjust intake if weight is trending down unintentionally.'
      ]
    },
    muscle_percent: {
      under: [
        'Resistance training 3x/week with progressive overload is the most direct way to raise this.',
        'Make sure protein is spread across 3–4 meals daily rather than one large serving.',
        'Reducing excess body fat alongside training will also raise this percentage over time.',
        'Track strength gains (weight lifted) as a leading indicator before the percentage visibly shifts.'
      ],
      good: [
        'Your muscle percentage is well-balanced — keep your current resistance training routine.',
        'Continue eating enough protein and total calories to support this level long-term.',
        'This is a good base for pursuing performance goals like strength or endurance targets.',
        'Periodic deload weeks help sustain this level without burning out.'
      ],
      warning: [
        'A higher muscle percentage is generally a good sign of an active lifestyle — keep it up.',
        'Balance strength training with mobility and cardio so overall fitness stays well-rounded.',
        'Make sure recovery and sleep keep pace with your current training volume.',
        'Keep monitoring alongside body fat percentage for the full picture of body composition.'
      ]
    },
    body_water_percent: {
      under: [
        'Sip water steadily through the day rather than large amounts at once — aim for pale yellow urine.',
        'Add water-rich foods like cucumber, watermelon, and soups alongside plain water.',
        "Rehydrate promptly after workouts and hot weather, when losses are highest.",
        "Limit alcohol and excess caffeine on days you're already trending low, as both increase fluid loss."
      ],
      good: [
        'Your hydration level looks healthy — keep drinking water consistently through the day.',
        'Continue matching water intake to activity level, especially on training or hot days.',
        'This level supports good circulation and recovery — no changes needed right now.',
        'Keep a water bottle handy as a simple reminder to sip regularly.'
      ],
      warning: [
        'Above-range body water is usually normal for very lean or well-hydrated people — no action needed.',
        "If this is new or paired with swelling, mention it at your next check-up.",
        'Continue your current hydration habits; this reading is more a data point than a concern.',
        'Cross-check against body fat percentage — leaner bodies naturally read higher here.'
      ]
    },
    protein_percent: {
      under: [
        'Spread protein across meals — aim for a palm-sized portion at breakfast, lunch, and dinner.',
        'Combine plant and animal protein sources (legumes, eggs, fish, dairy) for a fuller amino acid profile.',
        'Resistance training helps the body retain and use dietary protein more effectively.',
        'A protein shake or Greek yogurt is an easy way to close a small daily gap.'
      ],
      good: [
        'Your protein levels look well-balanced — keep your current diet and training routine.',
        'Continue spreading protein intake evenly across the day for steady recovery.',
        'This level supports both muscle maintenance and general health — no changes needed.',
        'Reassess only if your training volume or goals change significantly.'
      ],
      warning: [
        "Higher protein content isn't usually a concern on its own — just keep intake balanced with other nutrients.",
        "Make sure you're also getting enough fiber and healthy fats alongside a protein-rich diet.",
        "Stay well-hydrated, since higher protein intake increases the body's water needs somewhat.",
        'If this is paired with kidney concerns or medication, mention it to a doctor.'
      ]
    },
    bone_mineral_percent: {
      under: [
        'Increase calcium-rich foods like dairy, tofu, and leafy greens across the week.',
        'Get regular sun exposure or consider vitamin D through diet/supplements to aid calcium absorption.',
        'Weight-bearing exercise (walking, jogging, resistance training) stimulates bone density more than swimming or cycling alone.',
        'Cut back on excess salt and soft drinks, which can interfere with calcium retention over time.',
        'If bone mineral stays low, a bone density scan (DEXA) can give a clearer clinical picture.'
      ],
      good: [
        'Your bone mineral content is in a healthy range — keep up weight-bearing activity.',
        'Continue a balanced diet with adequate calcium and vitamin D to maintain this.',
        'Regular resistance training helps preserve bone density as you age.',
        'This is a good baseline — recheck periodically rather than worrying between scans.',
        'Keep moderate sun exposure and a varied diet to sustain this level long-term.'
      ]
    },
    skeletal_muscle: {
      under: [
        'Prioritize compound resistance exercises (squat, deadlift, press) 2–3x/week to build skeletal muscle.',
        'Protein intake around 1.6–2.2g/kg body weight supports muscle repair and growth.',
        'Progressive overload — small, steady increases in weight or reps — drives long-term gains.',
        'Allow 48 hours of recovery between training the same muscle group for best results.'
      ],
      good: [
        'Your skeletal muscle mass is in a healthy range — keep resistance training consistent.',
        'Maintain balanced nutrition with enough protein and calories to support this level.',
        'Adding some aerobic training 3–4x/week rounds out overall fitness alongside strength.',
        'Stretch after workouts to maintain mobility as muscle mass increases.'
      ],
      warning: [
        'Above-reference skeletal muscle is generally favorable — keep your current training and nutrition.',
        'Make sure recovery time and sleep keep pace with your training intensity.',
        'This level increases daily calorie needs — adjust intake if weight trends down unintentionally.',
        'Continue a balanced routine that also includes mobility work, not just heavy lifting.'
      ]
    },
    visceral_fat: {
      good: [
        'Your visceral fat rating is in the healthy range — keep your current diet and activity level.',
        'Continue regular cardio and a balanced diet to protect this healthy level.',
        'This is a good sign for metabolic health — maintain rather than change your routine.',
        'Recheck every few months as part of routine tracking, not out of concern.'
      ],
      warning: [
        'Add 20–30 minutes of moderate cardio most days to help reduce visceral fat specifically.',
        'Cut back on added sugar and refined carbs first — these are closely linked to visceral fat.',
        'Combine cardio with 2x/week strength training for better metabolic results than cardio alone.',
        'Prioritize sleep and stress management — both affect visceral fat through cortisol.'
      ],
      danger: [
        'Elevated visceral fat raises cardiovascular and metabolic risk — a doctor consult is worthwhile.',
        'Ask about screening for blood pressure, blood sugar, and cholesterol alongside this reading.',
        'Start with a structured, moderate calorie deficit combined with daily movement.',
        'Prioritize consistent cardio and reduced sugar intake as the two highest-impact first steps.'
      ]
    },
    bmr: {
      under: [
        'Building muscle through resistance training is the most reliable way to raise BMR over time.',
        'Avoid very low-calorie diets — they can further lower BMR by signaling the body to conserve energy.',
        'Eat regular meals rather than skipping, which helps keep metabolism steady.',
        'Prioritize protein, which has a higher thermic effect (burns more calories to digest) than fat or carbs.'
      ],
      good: [
        'Your BMR is in the normal range for your body composition — keep your current activity level.',
        'Maintain muscle mass through regular resistance training to protect this level over time.',
        'This is a healthy baseline — daily calorie needs can be estimated from this plus activity.',
        'No changes needed; recheck if body composition shifts significantly.'
      ],
      warning: [
        'A higher BMR usually reflects greater muscle mass — generally a favorable sign.',
        'Make sure calorie intake matches this higher energy need to avoid unintended weight loss.',
        'Continue strength training, which is likely a key reason for this higher reading.',
        'This means more flexibility in your diet — just keep nutrient quality in mind, not only quantity.'
      ]
    },
    waist_hip: {
      under: [
        'A low waist-to-hip ratio is generally favorable — no specific action needed here.',
        'Continue your current activity level, which likely supports this healthy fat distribution.',
        'Core strengthening exercises can help maintain good posture alongside this ratio.',
        'Keep tracking alongside body fat percentage for the fuller picture.'
      ],
      good: [
        'Your waist-to-hip ratio is in the standard range — keep your current diet and exercise habits.',
        'Continue a mix of core work and cardio to maintain this healthy distribution.',
        'This is a good indicator of low cardiovascular risk from fat distribution — maintain rather than change.',
        'Recheck periodically alongside weight and body fat for a complete trend.'
      ],
      warning: [
        'Add core and full-body strength work, which can help shift fat distribution over time.',
        'Prioritize reducing added sugar and alcohol, both linked to abdominal fat storage.',
        'Aerobic exercise 3–4x/week specifically helps reduce abdominal fat over weeks to months.',
        'Since this reading is estimated from other values, remeasuring waist and hip directly can confirm it.'
      ]
    },
    heart_rate: {
      under: [
        'A low resting heart rate is common in well-trained athletes and usually not a concern on its own.',
        "If it's paired with dizziness or fatigue, it's worth checking in with a doctor.",
        'Keep tracking this alongside your training load to see if it tracks with fitness improvements.',
        'No action needed if you feel well — this often reflects strong cardiovascular fitness.'
      ],
      good: [
        'Your heart rate is in the normal range — keep up your current activity and diet habits.',
        'Continue regular cardio to maintain or gradually improve cardiovascular fitness.',
        'This is a healthy baseline — track it over time rather than reacting to one reading.',
        'Good sleep and stress management help keep resting heart rate stable at this level.'
      ],
      warning: [
        'If this is a resting measurement and stays elevated, checking in with a doctor is a good idea.',
        'Reduce caffeine and stimulants close to measurement time, which can temporarily raise heart rate.',
        'Regular cardio training over weeks tends to gradually lower resting heart rate.',
        'Stress and poor sleep both raise resting heart rate — worth checking if either has changed recently.'
      ]
    },
    body_age: {
      good: [
        'Your body age is younger than your actual age — a strong sign of overall fitness.',
        'Keep your current training and nutrition habits, which are clearly paying off.',
        'Maintaining low body fat and healthy muscle mass is the main driver here — protect both.',
        'Use this as motivation to keep consistent rather than as a reason to ease off.',
        'Recheck every few months to confirm this trend continues as you age.'
      ],
      warning: [
        'Focus on reducing body fat percentage first — it has the largest effect on body age.',
        "Add resistance training if you haven't already; muscle mass strongly influences this score.",
        'Improve sleep and cardiovascular fitness, both of which factor into this estimate.',
        'Small, sustained changes over months move body age more than short intense pushes.',
        'Recheck in 2–3 months after consistent changes to see this number respond.'
      ]
    }
  },
  vi: {
    weight: {
      under: [
        'Hãy tăng thêm khoảng 300-500 kcal mỗi ngày từ thực phẩm giàu dinh dưỡng thay vì đồ ăn rỗng calo.',
        'Thêm bữa phụ giàu protein giữa các bữa chính — hạt, sữa chua, hoặc sữa protein đều tốt.',
        'Kết hợp tập kháng lực nhẹ để phần tăng cân nghiêng về cơ thay vì chỉ tăng mỡ.',
        'Nếu tình trạng nhẹ cân kéo dài nhiều tháng dù đã ăn nhiều hơn, nên đi khám tổng quát.'
      ],
      good: [
        'Cứ duy trì chế độ ăn và vận động hiện tại — những gì bạn đang làm đang hiệu quả.',
        'Cân vào cùng điều kiện (buổi sáng, trang phục tương tự) để các lần đo sau so sánh chính xác.',
        'Dùng mức này làm mốc và theo dõi xu hướng theo tuần thay vì phản ứng với biến động từng ngày.',
        'Kết hợp cả tập sức mạnh lẫn cardio để giữ thành phần cơ thể cân đối, không chỉ cân nặng.'
      ],
      warning: [
        'Nhắm tới mức thâm hụt calo vừa phải khoảng 300-500 kcal/ngày thay vì cắt giảm đột ngột.',
        'Thêm 2-3 buổi cardio hoặc tập kháng lực mỗi tuần để hỗ trợ giảm mỡ.',
        'Chú ý khẩu phần ăn và calo từ đồ uống (nước ngọt, rượu bia) — đây thường là nguồn calo bị bỏ qua.',
        'Theo dõi cân nặng theo tuần thay vì hàng ngày để giảm nhiễu do giữ nước.'
      ],
      danger: [
        'Cân nhắc gặp bác sĩ hoặc chuyên gia dinh dưỡng để có kế hoạch cá nhân hóa, bài bản.',
        'Ưu tiên thay đổi bền vững — giảm quá nhanh có thể phản tác dụng và gây mất cơ.',
        'Kiểm tra thêm các chỉ số liên quan như huyết áp, đường huyết song song với việc kiểm soát cân nặng.',
        'Đặt mục tiêu ngắn hạn trước (ví dụ 5% cân nặng hiện tại) thay vì nhắm cả hành trình dài cùng lúc.'
      ]
    },
    bmi: {
      under: [
        'Ưu tiên thực phẩm giàu năng lượng lành mạnh như hạt, ngũ cốc nguyên cám, dầu tốt để tăng BMI từ từ.',
        'Kết hợp lượng calo thêm vào với tập kháng lực để tăng khối cơ thay vì chỉ tăng mỡ.',
        'Ăn đúng giờ, đủ bữa — 3 bữa chính và 1-2 bữa phụ — thay vì bỏ bữa.',
        'Nếu BMI vẫn thấp mà không rõ nguyên nhân, nên đi khám để loại trừ vấn đề hấp thu hoặc tuyến giáp.'
      ],
      good: [
        'Cứ duy trì thói quen ăn uống và tập luyện hiện tại — BMI của bạn đang phản ánh sự cân bằng tốt.',
        'Nên theo dõi thêm vòng eo, vì BMI một mình chưa phản ánh được cách mỡ phân bố.',
        'Tiếp tục vận động đều đặn để giữ mức này ổn định khi lớn tuổi hơn.',
        'Đo lại sau vài tuần thay vì hàng ngày — BMI gần như không đổi trong ngày.'
      ],
      warning: [
        'Giảm khoảng 300-500 kcal mỗi ngày và tăng số bước đi hàng ngày.',
        'Ưu tiên protein và chất xơ trong mỗi bữa ăn để no lâu hơn với ít calo hơn.',
        'Thêm 2-3 buổi tập kháng lực mỗi tuần để giữ cơ trong khi BMI giảm.',
        'Cắt giảm tinh bột tinh chế và nước ngọt — những thứ thêm calo mà ít tạo cảm giác no.'
      ],
      danger: [
        'Nên tham khảo bác sĩ hoặc chuyên gia dinh dưỡng để có kế hoạch an toàn, bài bản.',
        'Kiểm tra thêm các chỉ số liên quan như huyết áp, đường huyết, mỡ máu.',
        'Bắt đầu bằng những thay đổi nhỏ, bền vững — số bước đi, giấc ngủ, đồ uống có đường là các mục tiêu tốt để bắt đầu.',
        'Đặt mục tiêu đưa BMI xuống mức kế tiếp trước, thay vì nhảy thẳng về mức bình thường.'
      ]
    },
    body_fat: {
      under: [
        'Tỉ lệ mỡ quá thấp có thể ảnh hưởng hormone — hãy đảm bảo tổng lượng calo nạp vào đủ.',
        'Bổ sung chất béo tốt (bơ, dầu ô liu, các loại hạt) thay vì cắt giảm chất béo quá mức.',
        'Kết hợp tập kháng lực với đủ thời gian hồi phục để hormone và hiệu suất được cân bằng.',
        'Nếu mỡ rất thấp kèm mệt mỏi hoặc rối loạn kinh nguyệt, nên đi khám bác sĩ.'
      ],
      good: [
        'Đây là mức lành mạnh, cân đối — hãy giữ chế độ ăn và tập luyện hiện tại.',
        'Tiếp tục kết hợp tập kháng lực và cardio để duy trì sự cân bằng này lâu dài.',
        'Dùng lần đo này làm mốc và kiểm tra lại sau vài tuần thay vì hàng ngày.',
        'Có thể chuyển trọng tâm sang mục tiêu sức mạnh hoặc hiệu suất thay vì giảm mỡ thêm.'
      ],
      warning: [
        'Thêm 2-3 buổi cardio cường độ vừa đến cao mỗi tuần bên cạnh lịch tập hiện tại.',
        'Giữ lượng protein cao trong khi giảm calo để bảo vệ cơ khi giảm mỡ.',
        'Ưu tiên cắt đường và đồ ăn vặt chế biến sẵn trước — đây thường là nguồn calo dễ cắt nhất.',
        'Tập kháng lực 2-3 lần/tuần giúp giữ cơ trong khi tỉ lệ mỡ giảm xuống.'
      ],
      danger: [
        'Một kế hoạch bài bản cùng chuyên gia (dinh dưỡng hoặc bác sĩ) sẽ cho kết quả tốt và an toàn hơn.',
        'Bắt đầu với mức thâm hụt calo vừa phải — cắt giảm quá mạnh thường phản tác dụng về lâu dài.',
        'Kiểm tra thêm các chỉ số chuyển hóa liên quan (đường huyết, mỡ máu) song song với việc giảm mỡ.',
        'Kết hợp thay đổi ăn uống với vận động đều đặn (đi bộ cũng tính) thay vì chỉ ăn kiêng.'
      ]
    },
    muscle_mass: {
      under: [
        'Thêm 2-3 buổi tập kháng lực mỗi tuần, tập trung vào các bài tổng hợp (squat, đẩy, kéo).',
        'Nạp khoảng 1.6-2.2g protein/kg cân nặng mỗi ngày để hỗ trợ phát triển cơ.',
        'Tăng dần mức tạ hoặc số reps theo thời gian quan trọng hơn là tập lâu.',
        'Ưu tiên ngủ đủ (7-9 giờ) vì phần lớn quá trình phục hồi cơ diễn ra khi nghỉ ngơi, không phải lúc tập.'
      ],
      good: [
        'Khối lượng cơ của bạn phát triển tốt — hãy tiếp tục duy trì tập kháng lực có tăng tiến.',
        'Duy trì đủ protein, chia đều trong các bữa ăn để hỗ trợ phục hồi liên tục.',
        'Thay đổi số reps theo chu kỳ (sức mạnh, phì đại, sức bền) để tiếp tục tiến bộ.',
        'Đây là nền tảng tốt — bạn có thể chuyển trọng tâm sang mục tiêu khác như thể lực hoặc linh hoạt.'
      ],
      warning: [
        'Khối lượng cơ cao hơn mức tham chiếu thường là dấu hiệu tốt — hãy giữ chế độ tập và dinh dưỡng hiện tại.',
        'Đảm bảo phục hồi theo kịp khối lượng tập để duy trì tiến bộ bền vững.',
        'Tiếp tục tập luyện cân bằng, bao gồm cả linh hoạt và cardio chứ không chỉ tập sức mạnh.',
        'Mức này đòi hỏi nhu cầu calo hàng ngày cao hơn — điều chỉnh khẩu phần nếu cân nặng giảm ngoài ý muốn.'
      ]
    },
    muscle_percent: {
      under: [
        'Tập kháng lực 3 lần/tuần với mức tạ tăng dần là cách trực tiếp nhất để tăng chỉ số này.',
        'Chia đều lượng protein trong 3-4 bữa mỗi ngày thay vì dồn vào một bữa lớn.',
        'Giảm mỡ thừa song song với tập luyện cũng sẽ giúp tỉ lệ cơ tăng theo thời gian.',
        'Theo dõi mức tạ tăng dần như một chỉ báo sớm trước khi tỉ lệ cơ thay đổi rõ rệt.'
      ],
      good: [
        'Tỉ lệ cơ của bạn đang cân đối — hãy tiếp tục chế độ tập kháng lực hiện tại.',
        'Tiếp tục ăn đủ protein và tổng calo để duy trì mức này lâu dài.',
        'Đây là nền tảng tốt để theo đuổi mục tiêu hiệu suất như sức mạnh hoặc sức bền.',
        'Các tuần giảm tải định kỳ giúp duy trì mức này mà không bị quá tải.'
      ],
      warning: [
        'Tỉ lệ cơ cao thường là dấu hiệu tốt của lối sống năng động — hãy tiếp tục phát huy.',
        'Cân bằng tập sức mạnh với linh hoạt và cardio để thể lực tổng thể toàn diện.',
        'Đảm bảo phục hồi và giấc ngủ theo kịp khối lượng tập hiện tại.',
        'Tiếp tục theo dõi song song với tỉ lệ mỡ để có bức tranh đầy đủ về thành phần cơ thể.'
      ]
    },
    body_water_percent: {
      under: [
        'Uống nước đều đặn suốt ngày thay vì uống nhiều một lúc — theo dõi màu nước tiểu vàng nhạt là đủ.',
        'Bổ sung thực phẩm nhiều nước như dưa leo, dưa hấu, canh súp bên cạnh việc uống nước lọc.',
        'Bù nước kịp thời sau khi tập luyện và trong thời tiết nóng, khi cơ thể mất nước nhiều nhất.',
        'Hạn chế rượu bia và quá nhiều caffeine vào những ngày tỉ lệ nước đang thấp, vì cả hai đều làm mất nước.'
      ],
      good: [
        'Mức nước cơ thể của bạn khá tốt — hãy tiếp tục uống nước đều đặn trong ngày.',
        'Tiếp tục điều chỉnh lượng nước theo mức vận động, đặc biệt vào ngày tập luyện hoặc trời nóng.',
        'Mức này hỗ trợ tuần hoàn và phục hồi tốt — chưa cần thay đổi gì.',
        'Luôn mang theo bình nước như một cách nhắc nhở đơn giản để uống đều.'
      ],
      warning: [
        'Tỉ lệ nước cao hơn mức chuẩn thường bình thường với người có tỉ lệ mỡ thấp hoặc uống đủ nước — không cần lo lắng.',
        'Nếu đây là thay đổi mới hoặc kèm sưng phù, nên đề cập khi khám sức khỏe lần tới.',
        'Cứ tiếp tục thói quen uống nước hiện tại; đây chỉ là một điểm dữ liệu, không phải vấn đề.',
        'Đối chiếu thêm với tỉ lệ mỡ cơ thể — người có tỉ lệ mỡ thấp thường có chỉ số này cao hơn tự nhiên.'
      ]
    },
    protein_percent: {
      under: [
        'Chia đều protein trong các bữa ăn — mỗi bữa nên có một phần bằng lòng bàn tay vào sáng, trưa, tối.',
        'Kết hợp cả nguồn đạm thực vật và động vật (đậu, trứng, cá, sữa) để đa dạng axit amin.',
        'Tập kháng lực giúp cơ thể giữ và sử dụng protein từ thức ăn hiệu quả hơn.',
        'Một ly sữa protein hoặc sữa chua Hy Lạp là cách đơn giản để bù phần thiếu nhỏ mỗi ngày.'
      ],
      good: [
        'Hàm lượng protein của bạn đang cân đối — hãy giữ chế độ ăn và tập luyện hiện tại.',
        'Tiếp tục chia đều protein trong ngày để phục hồi ổn định.',
        'Mức này hỗ trợ tốt cho việc duy trì cơ và sức khỏe tổng quát — chưa cần thay đổi.',
        'Chỉ cần xem lại nếu khối lượng tập hoặc mục tiêu của bạn thay đổi đáng kể.'
      ],
      warning: [
        'Hàm lượng protein cao thường không đáng lo — chỉ cần giữ cân bằng với các dưỡng chất khác.',
        'Đảm bảo bạn cũng nạp đủ chất xơ và chất béo tốt bên cạnh chế độ ăn giàu đạm.',
        'Uống đủ nước, vì nạp nhiều protein hơn khiến cơ thể cần nhiều nước hơn một chút.',
        'Nếu đi kèm vấn đề về thận hoặc đang dùng thuốc, nên trao đổi với bác sĩ.'
      ]
    },
    bone_mineral_percent: {
      under: [
        'Tăng cường thực phẩm giàu canxi như sữa, đậu phụ, rau lá xanh trong tuần.',
        'Phơi nắng hợp lý hoặc bổ sung vitamin D qua thực phẩm/thực phẩm chức năng để hỗ trợ hấp thu canxi.',
        'Vận động chịu trọng lực (đi bộ, chạy bộ, tập kháng lực) kích thích mật độ xương tốt hơn bơi lội hay đạp xe đơn thuần.',
        'Giảm muối và nước ngọt có gas — những thứ có thể cản trở việc giữ canxi trong cơ thể.',
        'Nếu khoáng xương vẫn thấp kéo dài, nên đo mật độ xương (DEXA) để có đánh giá lâm sàng rõ ràng hơn.'
      ],
      good: [
        'Hàm lượng khoáng xương của bạn ở mức khỏe mạnh — hãy tiếp tục vận động chịu trọng lực.',
        'Tiếp tục chế độ ăn cân bằng, đủ canxi và vitamin D để duy trì mức này.',
        'Tập kháng lực đều đặn giúp giữ mật độ xương khi lớn tuổi.',
        'Đây là mốc tốt — hãy kiểm tra định kỳ thay vì lo lắng giữa các lần đo.',
        'Duy trì phơi nắng vừa phải và chế độ ăn đa dạng để giữ mức này lâu dài.'
      ]
    },
    skeletal_muscle: {
      under: [
        'Ưu tiên các bài tập kháng lực tổng hợp (squat, deadlift, đẩy) 2-3 lần/tuần để phát triển cơ xương.',
        'Nạp khoảng 1.6-2.2g protein/kg cân nặng để hỗ trợ phục hồi và phát triển cơ.',
        'Tăng dần mức tạ hoặc số reps từng chút một sẽ mang lại tiến bộ bền vững.',
        'Nghỉ ít nhất 48 giờ trước khi tập lại cùng nhóm cơ để đạt hiệu quả tốt nhất.'
      ],
      good: [
        'Khối lượng cơ xương của bạn ở mức khỏe mạnh — hãy duy trì tập kháng lực đều đặn.',
        'Duy trì chế độ dinh dưỡng cân bằng, đủ protein và calo để giữ mức này.',
        'Thêm một số buổi cardio 3-4 lần/tuần để thể lực toàn diện hơn bên cạnh sức mạnh.',
        'Giãn cơ sau khi tập để giữ độ linh hoạt khi khối lượng cơ tăng lên.'
      ],
      warning: [
        'Cơ xương cao hơn mức tham chiếu thường là dấu hiệu tốt — hãy giữ chế độ tập và dinh dưỡng hiện tại.',
        'Đảm bảo thời gian phục hồi và giấc ngủ theo kịp cường độ tập luyện.',
        'Mức này làm tăng nhu cầu calo hàng ngày — điều chỉnh khẩu phần nếu cân nặng giảm ngoài ý muốn.',
        'Tiếp tục chế độ tập cân bằng, có cả bài tập linh hoạt chứ không chỉ tập nặng.'
      ]
    },
    visceral_fat: {
      good: [
        'Chỉ số mỡ nội tạng của bạn ở mức lành mạnh — hãy giữ chế độ ăn và vận động hiện tại.',
        'Tiếp tục cardio đều đặn và ăn uống cân bằng để bảo vệ mức lành mạnh này.',
        'Đây là dấu hiệu tốt cho sức khỏe chuyển hóa — hãy duy trì thay vì thay đổi thói quen.',
        'Kiểm tra lại sau vài tháng như một phần theo dõi định kỳ, không cần lo lắng.'
      ],
      warning: [
        'Thêm 20-30 phút cardio cường độ vừa hầu hết các ngày để giảm mỡ nội tạng.',
        'Ưu tiên cắt đường và tinh bột tinh chế trước — hai thứ này liên quan chặt đến mỡ nội tạng.',
        'Kết hợp cardio với tập kháng lực 2 lần/tuần để hiệu quả chuyển hóa tốt hơn cardio đơn thuần.',
        'Ưu tiên giấc ngủ và quản lý căng thẳng — cả hai đều ảnh hưởng đến mỡ nội tạng qua cortisol.'
      ],
      danger: [
        'Mỡ nội tạng cao làm tăng nguy cơ tim mạch và chuyển hóa — nên tham khảo ý kiến bác sĩ.',
        'Hỏi thêm về tầm soát huyết áp, đường huyết, mỡ máu song song với chỉ số này.',
        'Bắt đầu với mức thâm hụt calo vừa phải, bài bản kết hợp vận động hàng ngày.',
        'Ưu tiên cardio đều đặn và giảm đường — đây là hai bước đầu tiên có tác động lớn nhất.'
      ]
    },
    bmr: {
      under: [
        'Tăng cơ qua tập kháng lực là cách đáng tin cậy nhất để tăng BMR theo thời gian.',
        'Tránh chế độ ăn quá ít calo — điều này có thể khiến BMR giảm thêm do cơ thể chuyển sang chế độ tiết kiệm năng lượng.',
        'Ăn đúng bữa, đều đặn thay vì bỏ bữa, giúp giữ trao đổi chất ổn định.',
        'Ưu tiên protein — chất này có hiệu ứng sinh nhiệt cao hơn (tốn nhiều năng lượng tiêu hóa hơn) so với chất béo hay tinh bột.'
      ],
      good: [
        'BMR của bạn ở mức bình thường so với thành phần cơ thể hiện tại — hãy giữ mức vận động này.',
        'Duy trì khối lượng cơ qua tập kháng lực đều đặn để bảo vệ mức này lâu dài.',
        'Đây là mốc khỏe mạnh — nhu cầu calo hàng ngày có thể ước tính từ đây cộng thêm mức vận động.',
        'Chưa cần thay đổi gì; kiểm tra lại nếu thành phần cơ thể thay đổi đáng kể.'
      ],
      warning: [
        'BMR cao hơn thường phản ánh khối lượng cơ lớn hơn — nhìn chung là dấu hiệu tốt.',
        'Đảm bảo lượng calo nạp vào phù hợp với nhu cầu năng lượng cao hơn này để tránh sụt cân ngoài ý muốn.',
        'Tiếp tục tập kháng lực — đây có thể là lý do chính giúp chỉ số này cao.',
        'Điều này nghĩa là bạn có thể linh hoạt hơn trong ăn uống — chỉ cần chú ý chất lượng, không chỉ số lượng.'
      ]
    },
    waist_hip: {
      under: [
        'Tỉ lệ eo-hông thấp thường là dấu hiệu tốt — chưa cần hành động cụ thể ở đây.',
        'Tiếp tục mức vận động hiện tại, có thể đang hỗ trợ sự phân bố mỡ lành mạnh này.',
        'Bài tập core giúp giữ tư thế tốt song song với tỉ lệ này.',
        'Tiếp tục theo dõi cùng với tỉ lệ mỡ cơ thể để có bức tranh đầy đủ hơn.'
      ],
      good: [
        'Tỉ lệ eo-hông của bạn ở mức chuẩn — hãy giữ chế độ ăn và tập luyện hiện tại.',
        'Tiếp tục kết hợp bài tập core và cardio để duy trì sự phân bố mỡ lành mạnh này.',
        'Đây là dấu hiệu tốt cho thấy nguy cơ tim mạch từ phân bố mỡ thấp — hãy duy trì thay vì thay đổi.',
        'Kiểm tra định kỳ cùng với cân nặng và tỉ lệ mỡ để có xu hướng đầy đủ.'
      ],
      warning: [
        'Thêm bài tập core và toàn thân, có thể giúp thay đổi cách phân bố mỡ theo thời gian.',
        'Ưu tiên giảm đường và rượu bia — cả hai đều liên quan đến tích mỡ vùng bụng.',
        'Tập aerobic 3-4 lần/tuần đặc biệt giúp giảm mỡ bụng sau vài tuần đến vài tháng.',
        'Vì chỉ số này được ước tính từ các số liệu khác, đo trực tiếp vòng eo và vòng hông sẽ giúp xác nhận chính xác hơn.'
      ]
    },
    heart_rate: {
      under: [
        'Nhịp tim nghỉ thấp thường gặp ở người tập luyện lâu năm và thường không đáng lo.',
        'Nếu kèm chóng mặt hoặc mệt mỏi, nên trao đổi với bác sĩ.',
        'Tiếp tục theo dõi chỉ số này cùng khối lượng tập để xem có tương ứng với cải thiện thể lực không.',
        'Không cần hành động gì nếu bạn thấy khỏe — đây thường phản ánh thể lực tim mạch tốt.'
      ],
      good: [
        'Nhịp tim của bạn ở mức bình thường — hãy tiếp tục thói quen vận động và ăn uống hiện tại.',
        'Tiếp tục cardio đều đặn để duy trì hoặc cải thiện dần thể lực tim mạch.',
        'Đây là mốc khỏe mạnh — hãy theo dõi theo thời gian thay vì phản ứng với một lần đo.',
        'Ngủ đủ và quản lý căng thẳng giúp giữ nhịp tim nghỉ ổn định ở mức này.'
      ],
      warning: [
        'Nếu đây là số đo lúc nghỉ và vẫn cao, nên trao đổi với bác sĩ.',
        'Giảm caffeine và chất kích thích gần thời điểm đo, vì chúng có thể tạm thời làm tăng nhịp tim.',
        'Tập cardio đều đặn trong vài tuần thường giúp giảm dần nhịp tim khi nghỉ.',
        'Căng thẳng và thiếu ngủ đều làm tăng nhịp tim nghỉ — nên kiểm tra xem gần đây có thay đổi không.'
      ]
    },
    body_age: {
      good: [
        'Tuổi cơ thể của bạn nhỏ hơn tuổi thật — dấu hiệu rõ ràng của thể trạng tốt.',
        'Hãy giữ thói quen tập luyện và dinh dưỡng hiện tại, rõ ràng đang phát huy hiệu quả.',
        'Duy trì tỉ lệ mỡ thấp và khối cơ khỏe mạnh là yếu tố chính ở đây — hãy bảo vệ cả hai.',
        'Dùng kết quả này làm động lực để duy trì đều đặn, không phải lý do để lơi lỏng.',
        'Kiểm tra lại sau vài tháng để xác nhận xu hướng này tiếp tục khi bạn lớn tuổi hơn.'
      ],
      warning: [
        'Ưu tiên giảm tỉ lệ mỡ cơ thể trước — đây là yếu tố ảnh hưởng lớn nhất đến tuổi cơ thể.',
        'Thêm tập kháng lực nếu chưa có; khối lượng cơ ảnh hưởng mạnh đến chỉ số này.',
        'Cải thiện giấc ngủ và thể lực tim mạch, cả hai đều là yếu tố trong ước tính này.',
        'Thay đổi nhỏ nhưng bền vững trong nhiều tháng tác động tới tuổi cơ thể hơn là cố gắng dồn dập trong thời gian ngắn.',
        'Kiểm tra lại sau 2-3 tháng thay đổi đều đặn để thấy chỉ số này phản hồi.'
      ]
    }
  }
};

// Finds the numeric [lo, hi) span the given tier occupies within a boundaries array (as returned
// by DEFAULT_METRIC_BOUNDARIES / the personalized `/api/body-composition/ranges` response) — the
// first segment whose label maps to this tier, since a metric can have more than one segment
// mapping to the same tier (e.g. visceral fat's "Very high" and "Dangerous" both read as 'danger').
function tierNumericSpan(boundaries, tier) {
  if (!Array.isArray(boundaries) || !boundaries.length) return null;
  let lo = 0;
  for (const b of boundaries) {
    const hi = Number(b.max);
    if (!Number.isFinite(hi)) continue;
    if (gradeColorTier(b.label) === tier) return { lo, hi };
    lo = hi;
  }
  return null;
}

// Steps through every opener/action combination in order as `value` sweeps from the bottom to the
// top of its tier's numeric span, so a slightly different reading (even within the same tier) can
// land on different advice instead of always repeating the same sentence.
function comboIndexFromValue(value, span, totalCombos) {
  if (!Number.isFinite(value) || totalCombos <= 1) return 0;
  let frac;
  if (span && Number.isFinite(span.lo) && Number.isFinite(span.hi) && span.hi > span.lo) {
    frac = (value - span.lo) / (span.hi - span.lo);
  } else {
    // No usable span (e.g. body_age, which has no boundaries entry, or an open-ended tier) — still
    // vary the pick using the reading's own decimal pattern rather than always index 0.
    frac = Math.abs(value * 37) % 1;
  }
  frac = Math.min(0.999999, Math.max(0, frac));
  return Math.floor(frac * totalCombos);
}

// Fallback reference thresholds for the gradient boundary bar, used only when the user hasn't set
// their own personalized ranges via PUT /api/body-composition/ranges (which the scale's own app
// derives from age/gender/height, and this app currently has no UI to input — see
// `body_metric_ranges` table). These are representative adult reference values, not personalized;
// good enough to make the bar meaningful out of the box rather than showing nothing.
export const DEFAULT_METRIC_BOUNDARIES = {
  bmi: [{ label: 'Under', max: 18.5 }, { label: 'Standard', max: 24 }, { label: 'Over', max: 28 }, { label: 'High', max: 32 }],
  body_fat: [{ label: 'Under', max: 10 }, { label: 'Standard', max: 20 }, { label: 'Over', max: 26 }, { label: 'High', max: 35 }],
  muscle_percent: [{ label: 'Under', max: 69.1 }, { label: 'Standard', max: 87.3 }, { label: 'Good', max: 95 }],
  muscle_mass: [{ label: 'Under', max: 44.4 }, { label: 'Standard', max: 56.1 }, { label: 'Good', max: 65 }],
  body_water_percent: [{ label: 'Under', max: 53.7 }, { label: 'Standard', max: 66.2 }, { label: 'Good', max: 75 }],
  protein_percent: [{ label: 'Under', max: 12.5 }, { label: 'Standard', max: 21.6 }, { label: 'Over', max: 30 }],
  bone_mineral_percent: [{ label: 'Under', max: 5 }, { label: 'Normal', max: 10 }],
  skeletal_muscle: [{ label: 'Under', max: 24.8 }, { label: 'Standard', max: 34.6 }, { label: 'Good', max: 40 }],
  visceral_fat: [{ label: 'Fit', max: 4.5 }, { label: 'High', max: 9.5 }, { label: 'Very high', max: 14.5 }, { label: 'Dangerous', max: 30 }],
  bmr: [{ label: 'Under', max: 1275 }, { label: 'Normal', max: 1725 }, { label: 'Over', max: 2200 }],
  waist_hip: [{ label: 'Under', max: 0.8 }, { label: 'Standard', max: 0.9 }, { label: 'Over', max: 1.3 }],
  heart_rate: [{ label: 'Under', max: 60 }, { label: 'Normal', max: 100 }, { label: 'Over', max: 180 }]
};

export function metricDescription(key, lang) {
  return (METRIC_DESCRIPTIONS[lang] || METRIC_DESCRIPTIONS.en)[key] || null;
}

// `opts.value`/`opts.boundaries` let the advice vary at fine-grained thresholds within the tier
// instead of only at the tier boundary itself (see the OPENERS/ACTIONS comment above); both are
// optional so existing callers that only care about the tier-level text still get a sensible
// (fixed) result. `opts.label` is the metric's display label, substituted into the opener template.
export function metricAnalysis(key, tier, lang, opts = {}) {
  if (!tier) return null;
  const { value, boundaries, label } = opts;
  const openerList = (OPENERS[lang] || OPENERS.en)[tier];
  const actionTable = (ACTIONS[lang] || ACTIONS.en)[key];
  const actionList = actionTable?.[tier];
  if (!openerList?.length || !actionList?.length) return null;
  const totalCombos = openerList.length * actionList.length;
  const span = tierNumericSpan(boundaries, tier);
  const comboIndex = comboIndexFromValue(Number(value), span, totalCombos);
  const openerIndex = Math.floor(comboIndex / actionList.length);
  const actionIndex = comboIndex % actionList.length;
  const openerText = openerList[openerIndex].replace('{metric}', label || '');
  return `${openerText} ${actionList[actionIndex]}`;
}
