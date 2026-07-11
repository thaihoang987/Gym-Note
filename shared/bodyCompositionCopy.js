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

// Keyed by the same 4 tiers gradeColorTier already collapses every grade word into. A metric
// whose real report only ever shows 2-3 of these tiers (e.g. bone mineral percentage is only ever
// "Under" or "Normal") simply never looks up the tiers it can't have — no need to write unused text.
export const METRIC_ANALYSIS = {
  en: {
    weight: {
      under: 'Your weight is below the standard range for your height. Please maintain a balanced diet and consult a professional if this persists.',
      good: 'Your weight is in the standard range. Please continue to maintain a healthy diet and an appropriate amount of exercise.',
      warning: 'Your weight is above the standard range. Consider a moderate calorie deficit and regular exercise to bring it back toward standard.',
      danger: 'Your weight is well outside the standard range. Please consider consulting a professional for personalized guidance.'
    },
    bmi: {
      under: 'Your BMI is below normal. Please ensure adequate nutrition and consult a professional if you are underweight.',
      good: 'Your BMI is normal. Please maintain a healthy diet and exercise habits to prevent excessive accumulation of abdominal fat.',
      warning: 'Your BMI is above normal. Please control calorie intake and increase physical activity to bring it back to a healthy range.',
      danger: 'Your BMI is significantly above normal, which raises long-term health risks. Please consider consulting a professional for personalized guidance.'
    },
    body_fat: {
      under: 'Your body fat percentage is below the standard range. Essential fat is still needed for hormonal and organ function — make sure your diet is adequate.',
      good: 'Your body fat percentage is in the normal range. Your body is well-proportioned and you have a low risk of suffering from diseases. Please continue to maintain a healthy diet and an appropriate amount of exercise.',
      warning: 'Your body fat percentage is above standard. Please control calorie intake and add more aerobic exercise to bring it back toward standard.',
      danger: 'Your body fat percentage is high, which increases the risk of metabolic disease. Please consider consulting a professional for a structured plan.'
    },
    muscle_mass: {
      under: 'Your muscle mass is below the standard range. Adding resistance training and adequate protein intake can help build it up.',
      good: 'Your muscle mass is in the standard range. Please continue to maintain a healthy diet and an appropriate amount of exercise.',
      warning: 'Your muscle mass is above the reference range, which is generally favorable — keep up your current training and nutrition.'
    },
    muscle_percent: {
      under: 'Your muscle percentage is below the standard range. Please continue to maintain a healthy diet and an appropriate amount of exercise, with a focus on resistance training.',
      good: 'Your muscle mass is in the standard range. Please continue to maintain a healthy diet and an appropriate amount of exercise.',
      warning: 'Your muscle percentage is above the standard range, which is generally a good sign of an active lifestyle.'
    },
    body_water_percent: {
      under: 'Your body water is below normal. It is recommended to increase your water intake throughout the day.',
      good: 'Your body water is normal. It is recommended to drink an appropriate amount of water.',
      warning: 'Your body water is above the standard range, which can be normal for very lean or well-hydrated individuals.'
    },
    protein_percent: {
      under: 'Your body protein content is below the standard range. Increasing dietary protein intake alongside resistance training can help.',
      good: 'Your body protein content is in the standard range. Please continue to maintain a healthy diet and an appropriate amount of exercise.',
      warning: 'Your body protein content is above the standard range, which is generally not a concern on its own.'
    },
    bone_mineral_percent: {
      under: 'Your bone mineral content is insufficient. It may lead to a decrease in bone quality, changes in bone microstructure, and proneness to bone brittleness, bone pain, muscle weakness, etc. It is recommended to improve living habits, ensure adequate sleep, appropriate exercise, scientific calcium supplementation, increase the intake of eggs, fish, kelp, green leafy vegetables, soybean products, and reduce the intake of greasy food.',
      good: 'Your bone mineral content is in the normal range. Please continue a balanced diet with adequate calcium and vitamin D.'
    },
    skeletal_muscle: {
      under: 'Your skeletal muscle mass is below the standard range. Regular resistance training and adequate protein intake can help build it up.',
      good: 'Your skeletal muscle mass is in the normal range, indicating great muscle strength and responding speed. Please keep a balanced diet, ensure adequate daily intake of protein, take aerobic exercise 3 to 4 times a week, and stretch muscles after exercise.',
      warning: 'Your skeletal muscle mass is above the reference range, which is generally favorable — keep up your current training and nutrition.'
    },
    visceral_fat: {
      good: 'Your visceral fat rating is in the healthy range. Please continue to maintain a healthy diet and an appropriate amount of exercise.',
      warning: 'It is recommended to take an appropriate amount of exercise and control calorie intake to reduce the amount of visceral fat to a standard level.',
      danger: 'Your visceral fat rating is significantly elevated, which raises cardiovascular and metabolic risk. Please consider consulting a professional for a structured plan.'
    },
    bmr: {
      under: 'The basal metabolic rate of healthy people is determined by body muscle content. When the body fat percentage is high and the muscle content is low, this may lower the basal metabolic rate. Therefore, it is recommended to gain muscle and lose fat to increase your basal metabolic rate.',
      good: 'Your basal metabolic rate is in the normal range for your body composition.',
      warning: 'Your basal metabolic rate is above the typical range, which usually reflects higher muscle mass — generally a favorable sign.'
    },
    waist_hip: {
      under: 'Your waist-to-hip ratio is below the standard range.',
      good: 'Your waist-to-hip ratio is in the standard range. Please continue to maintain a healthy diet and an appropriate amount of exercise.',
      warning: 'Your waist-to-hip ratio is above standard, suggesting more fat is stored around the waist. Please control calorie intake and add core/aerobic exercise.'
    },
    heart_rate: {
      under: 'Your heart rate is below the typical resting range, which is common for well-trained athletes but worth mentioning to a doctor if you feel symptoms.',
      good: 'The heart rate is normal. Heart rate changes are closely related to heart health. In order to enhance heart health, please keep healthy eating and exercise habits.',
      warning: 'Your heart rate is above the typical resting range. If this persists at rest, consider checking in with a doctor.'
    },
    // Unlike every other metric here, body age has no grade badge on the report at all — its tier
    // is computed by the report page from comparing this value against the user's actual age
    // (from their profile birth date), not read off a report field, so only these two tiers are
    // ever reached (see BodyCompositionDetailPopup).
    body_age: {
      good: 'The physical age is smaller than the actual age, indicating that the physical condition is very good. Please continue to maintain a healthy lifestyle.',
      warning: 'The physical age is greater than the actual age. It is recommended to pay more attention to your body composition, especially reducing body fat percentage, to help lower your physical age.'
    }
  },
  vi: {
    weight: {
      under: 'Cân nặng của bạn thấp hơn mức chuẩn so với chiều cao. Hãy duy trì chế độ ăn cân bằng và tham khảo ý kiến chuyên gia nếu tình trạng này kéo dài.',
      good: 'Cân nặng của bạn đang ở mức chuẩn. Hãy tiếp tục duy trì chế độ ăn lành mạnh và tập luyện phù hợp.',
      warning: 'Cân nặng của bạn cao hơn mức chuẩn. Cân nhắc giảm nhẹ lượng calo nạp vào và tập luyện đều đặn để đưa về mức chuẩn.',
      danger: 'Cân nặng của bạn lệch khá xa mức chuẩn. Hãy cân nhắc tham khảo ý kiến chuyên gia để có hướng dẫn phù hợp.'
    },
    bmi: {
      under: 'BMI của bạn thấp hơn mức bình thường. Hãy đảm bảo dinh dưỡng đầy đủ và tham khảo ý kiến chuyên gia nếu bạn đang thiếu cân.',
      good: 'BMI của bạn ở mức bình thường. Hãy duy trì chế độ ăn lành mạnh và thói quen tập luyện để tránh tích mỡ bụng quá mức.',
      warning: 'BMI của bạn cao hơn mức bình thường. Hãy kiểm soát lượng calo nạp vào và tăng cường vận động để đưa BMI về mức lành mạnh.',
      danger: 'BMI của bạn cao hơn đáng kể so với mức bình thường, làm tăng rủi ro sức khỏe lâu dài. Hãy cân nhắc tham khảo ý kiến chuyên gia để có hướng dẫn phù hợp.'
    },
    body_fat: {
      under: 'Tỉ lệ mỡ cơ thể của bạn thấp hơn mức chuẩn. Cơ thể vẫn cần một lượng mỡ thiết yếu cho hormone và chức năng nội tạng — hãy đảm bảo chế độ ăn đầy đủ.',
      good: 'Tỉ lệ mỡ cơ thể của bạn ở mức bình thường. Cơ thể bạn cân đối và có nguy cơ mắc bệnh thấp. Hãy tiếp tục duy trì chế độ ăn lành mạnh và tập luyện phù hợp.',
      warning: 'Tỉ lệ mỡ cơ thể của bạn cao hơn mức chuẩn. Hãy kiểm soát lượng calo nạp vào và tăng cường vận động aerobic để đưa về mức chuẩn.',
      danger: 'Tỉ lệ mỡ cơ thể của bạn cao, làm tăng nguy cơ rối loạn chuyển hóa. Hãy cân nhắc tham khảo ý kiến chuyên gia để có kế hoạch cụ thể.'
    },
    muscle_mass: {
      under: 'Khối lượng cơ của bạn thấp hơn mức chuẩn. Tập luyện sức mạnh kết hợp nạp đủ protein sẽ giúp cải thiện.',
      good: 'Khối lượng cơ của bạn ở mức chuẩn. Hãy tiếp tục duy trì chế độ ăn lành mạnh và tập luyện phù hợp.',
      warning: 'Khối lượng cơ của bạn cao hơn mức tham chiếu, nhìn chung là dấu hiệu tốt — hãy tiếp tục chế độ tập luyện và dinh dưỡng hiện tại.'
    },
    muscle_percent: {
      under: 'Tỉ lệ cơ của bạn thấp hơn mức chuẩn. Hãy tiếp tục duy trì chế độ ăn lành mạnh và tập luyện phù hợp, chú trọng tập kháng lực.',
      good: 'Khối lượng cơ của bạn ở mức chuẩn. Hãy tiếp tục duy trì chế độ ăn lành mạnh và tập luyện phù hợp.',
      warning: 'Tỉ lệ cơ của bạn cao hơn mức chuẩn, đây thường là dấu hiệu tốt của lối sống năng động.'
    },
    body_water_percent: {
      under: 'Tỉ lệ nước cơ thể của bạn thấp hơn bình thường. Nên uống nhiều nước hơn trong ngày.',
      good: 'Tỉ lệ nước cơ thể của bạn ở mức bình thường. Nên uống lượng nước phù hợp.',
      warning: 'Tỉ lệ nước cơ thể của bạn cao hơn mức chuẩn, điều này thường bình thường với người có tỉ lệ mỡ thấp hoặc đủ nước.'
    },
    protein_percent: {
      under: 'Hàm lượng protein cơ thể của bạn thấp hơn mức chuẩn. Tăng cường protein trong khẩu phần ăn kết hợp tập kháng lực sẽ giúp cải thiện.',
      good: 'Hàm lượng protein cơ thể của bạn ở mức chuẩn. Hãy tiếp tục duy trì chế độ ăn lành mạnh và tập luyện phù hợp.',
      warning: 'Hàm lượng protein cơ thể của bạn cao hơn mức chuẩn, nhìn chung không đáng lo ngại.'
    },
    bone_mineral_percent: {
      under: 'Hàm lượng khoáng xương của bạn không đủ. Điều này có thể làm giảm chất lượng xương, thay đổi cấu trúc vi mô của xương, dễ gãy xương, đau xương, yếu cơ... Nên cải thiện thói quen sinh hoạt, ngủ đủ giấc, tập luyện phù hợp, bổ sung canxi khoa học, tăng cường trứng, cá, tảo bẹ, rau lá xanh, đậu nành, và giảm đồ ăn nhiều dầu mỡ.',
      good: 'Hàm lượng khoáng xương của bạn ở mức bình thường. Hãy tiếp tục chế độ ăn cân bằng với đủ canxi và vitamin D.'
    },
    skeletal_muscle: {
      under: 'Khối lượng cơ xương của bạn thấp hơn mức chuẩn. Tập kháng lực đều đặn kết hợp nạp đủ protein sẽ giúp cải thiện.',
      good: 'Khối lượng cơ xương của bạn ở mức bình thường, cho thấy sức mạnh cơ và tốc độ phản ứng tốt. Hãy duy trì chế độ ăn cân bằng, đảm bảo đủ protein mỗi ngày, tập aerobic 3-4 lần/tuần, và giãn cơ sau khi tập.',
      warning: 'Khối lượng cơ xương của bạn cao hơn mức tham chiếu, nhìn chung là dấu hiệu tốt — hãy tiếp tục chế độ tập luyện và dinh dưỡng hiện tại.'
    },
    visceral_fat: {
      good: 'Chỉ số mỡ nội tạng của bạn ở mức lành mạnh. Hãy tiếp tục duy trì chế độ ăn lành mạnh và tập luyện phù hợp.',
      warning: 'Nên tập luyện phù hợp và kiểm soát lượng calo nạp vào để đưa mỡ nội tạng về mức chuẩn.',
      danger: 'Chỉ số mỡ nội tạng của bạn cao đáng kể, làm tăng nguy cơ tim mạch và rối loạn chuyển hóa. Hãy cân nhắc tham khảo ý kiến chuyên gia để có kế hoạch cụ thể.'
    },
    bmr: {
      under: 'Tỉ lệ trao đổi chất cơ bản của người khỏe mạnh phụ thuộc vào lượng cơ trong cơ thể. Khi tỉ lệ mỡ cao và lượng cơ thấp, tỉ lệ trao đổi chất cơ bản có thể giảm. Vì vậy, nên tăng cơ giảm mỡ để cải thiện chỉ số này.',
      good: 'Tỉ lệ trao đổi chất cơ bản của bạn ở mức bình thường so với thành phần cơ thể hiện tại.',
      warning: 'Tỉ lệ trao đổi chất cơ bản của bạn cao hơn mức thông thường, thường phản ánh khối lượng cơ lớn hơn — nhìn chung là dấu hiệu tốt.'
    },
    waist_hip: {
      under: 'Tỉ lệ eo-hông của bạn thấp hơn mức chuẩn.',
      good: 'Tỉ lệ eo-hông của bạn ở mức chuẩn. Hãy tiếp tục duy trì chế độ ăn lành mạnh và tập luyện phù hợp.',
      warning: 'Tỉ lệ eo-hông của bạn cao hơn mức chuẩn, cho thấy mỡ tích tụ nhiều hơn quanh vùng eo. Hãy kiểm soát lượng calo nạp vào và tăng cường tập core/aerobic.'
    },
    heart_rate: {
      under: 'Nhịp tim của bạn thấp hơn mức nghỉ thông thường, thường gặp ở người tập luyện lâu năm, nhưng nên trao đổi với bác sĩ nếu có triệu chứng bất thường.',
      good: 'Nhịp tim của bạn ở mức bình thường. Thay đổi nhịp tim liên quan chặt chẽ đến sức khỏe tim mạch. Để tăng cường sức khỏe tim, hãy duy trì thói quen ăn uống và tập luyện lành mạnh.',
      warning: 'Nhịp tim của bạn cao hơn mức nghỉ thông thường. Nếu tình trạng này kéo dài ngay cả khi nghỉ ngơi, nên trao đổi với bác sĩ.'
    },
    body_age: {
      good: 'Tuổi cơ thể nhỏ hơn tuổi thật, cho thấy thể trạng của bạn rất tốt. Hãy tiếp tục duy trì lối sống lành mạnh.',
      warning: 'Tuổi cơ thể lớn hơn tuổi thật. Nên chú ý hơn đến thành phần cơ thể, đặc biệt là giảm tỉ lệ mỡ, để giúp cải thiện tuổi cơ thể.'
    }
  }
};

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

export function metricAnalysis(key, tier, lang) {
  if (!tier) return null;
  const table = METRIC_ANALYSIS[lang] || METRIC_ANALYSIS.en;
  return table[key]?.[tier] || null;
}
