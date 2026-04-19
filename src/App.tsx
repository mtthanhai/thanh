import { useState } from 'react';

interface Solution {
  type: 'two-real' | 'one-real' | 'complex' | 'linear' | 'all' | 'none';
  x1?: number | string;
  x2?: number | string;
  message?: string;
}

function App() {
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');
  const [c, setC] = useState<string>('');
  const [solution, setSolution] = useState<Solution | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  const solveEquation = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    // Kiểm tra input
    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
      setSolution({
        type: 'none',
        message: 'Vui lòng nhập đầy đủ các hệ số a, b, c'
      });
      return;
    }

    // Trường hợp a = 0 (phương trình bậc nhất)
    if (numA === 0) {
      if (numB === 0) {
        if (numC === 0) {
          setSolution({
            type: 'all',
            message: 'Phương trình có vô số nghiệm (mọi x đều là nghiệm)'
          });
        } else {
          setSolution({
            type: 'none',
            message: 'Phương trình vô nghiệm'
          });
        }
      } else {
        const x = -numC / numB;
        setSolution({
          type: 'linear',
          x1: x,
          message: `Phương trình bậc nhất: ${numB}x + ${numC} = 0`
        });
      }
      return;
    }

    // Tính delta
    const delta = numB * numB - 4 * numA * numC;

    if (delta > 0) {
      // Hai nghiệm phân biệt
      const x1 = (-numB + Math.sqrt(delta)) / (2 * numA);
      const x2 = (-numB - Math.sqrt(delta)) / (2 * numA);
      setSolution({
        type: 'two-real',
        x1: x1,
        x2: x2
      });
    } else if (delta === 0) {
      // Nghiệm kép
      const x = -numB / (2 * numA);
      setSolution({
        type: 'one-real',
        x1: x
      });
    } else {
      // Nghiệm phức
      const realPart = -numB / (2 * numA);
      const imaginaryPart = Math.sqrt(-delta) / (2 * numA);
      setSolution({
        type: 'complex',
        x1: `${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i`,
        x2: `${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i`
      });
    }

    setShowSteps(true);
  };

  const reset = () => {
    setA('');
    setB('');
    setC('');
    setSolution(null);
    setShowSteps(false);
  };

  const renderSteps = () => {
    if (!solution || !showSteps) return null;

    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (numA === 0) return null;

    const delta = numB * numB - 4 * numA * numC;

    return (
      <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">📝 Các bước giải:</h3>
        <div className="space-y-3 text-gray-700">
          <p className="font-medium">
            Phương trình: {numA !== 1 && numA !== -1 ? numA : numA === -1 ? '-' : ''}x² 
            {numB >= 0 ? ' + ' : ' - '}{Math.abs(numB) !== 1 ? Math.abs(numB) : ''}x 
            {numC >= 0 ? ' + ' : ' - '}{Math.abs(numC)} = 0
          </p>
          <p><strong>Bước 1:</strong> Xác định hệ số: a = {numA}, b = {numB}, c = {numC}</p>
          <p><strong>Bước 2:</strong> Tính delta (Δ): Δ = b² - 4ac</p>
          <p className="ml-8">
            Δ = ({numB})² - 4 × ({numA}) × ({numC})
          </p>
          <p className="ml-8">
            Δ = {numB * numB} - {4 * numA * numC}
          </p>
          <p className="ml-8 font-semibold text-blue-700">
            Δ = {delta.toFixed(4)}
          </p>
          <p><strong>Bước 3:</strong> Kết luận:</p>
          {delta > 0 && (
            <div className="ml-8 space-y-2">
              <p>• Δ {'>'} 0 → Phương trình có 2 nghiệm phân biệt</p>
              <p>• x₁ = (-b + √Δ) / (2a) = {solution.x1}</p>
              <p>• x₂ = (-b - √Δ) / (2a) = {solution.x2}</p>
            </div>
          )}
          {delta === 0 && (
            <div className="ml-8 space-y-2">
              <p>• Δ = 0 → Phương trình có nghiệm kép</p>
              <p>• x = -b / (2a) = {solution.x1}</p>
            </div>
          )}
          {delta < 0 && (
            <div className="ml-8 space-y-2">
              <p>• Δ {'<'} 0 → Phương trình có 2 nghiệm phức</p>
              <p>• x₁ = {solution.x1}</p>
              <p>• x₂ = {solution.x2}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSolution = () => {
    if (!solution) return null;

    return (
      <div className="mt-8">
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 shadow-lg">
          <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
            <span>✅</span> Kết quả:
          </h3>
          
          {solution.type === 'two-real' && (
            <div className="space-y-3">
              <p className="text-lg text-gray-700">Phương trình có <strong>hai nghiệm phân biệt</strong>:</p>
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
                <p className="text-xl font-semibold text-blue-600">x₁ = {typeof solution.x1 === 'number' ? solution.x1.toFixed(4) : solution.x1}</p>
                <p className="text-xl font-semibold text-blue-600">x₂ = {typeof solution.x2 === 'number' ? solution.x2.toFixed(4) : solution.x2}</p>
              </div>
            </div>
          )}

          {solution.type === 'one-real' && (
            <div className="space-y-3">
              <p className="text-lg text-gray-700">Phương trình có <strong>nghiệm kép</strong>:</p>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xl font-semibold text-blue-600">x = {typeof solution.x1 === 'number' ? solution.x1.toFixed(4) : solution.x1}</p>
              </div>
            </div>
          )}

          {solution.type === 'complex' && (
            <div className="space-y-3">
              <p className="text-lg text-gray-700">Phương trình có <strong>hai nghiệm phức</strong>:</p>
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
                <p className="text-xl font-semibold text-purple-600">x₁ = {solution.x1}</p>
                <p className="text-xl font-semibold text-purple-600">x₂ = {solution.x2}</p>
              </div>
            </div>
          )}

          {solution.type === 'linear' && (
            <div className="space-y-3">
              <p className="text-lg text-gray-700">{solution.message}</p>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xl font-semibold text-blue-600">x = {typeof solution.x1 === 'number' ? solution.x1.toFixed(4) : solution.x1}</p>
              </div>
            </div>
          )}

          {(solution.type === 'all' || solution.type === 'none') && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-lg font-semibold text-gray-700">{solution.message}</p>
            </div>
          )}
        </div>

        {renderSteps()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
            🧮 Giải Phương Trình Bậc 2
          </h1>
          <p className="text-xl text-gray-600">ax² + bx + c = 0</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Hệ số a (x²):
              </label>
              <input
                type="number"
                step="any"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Nhập hệ số a"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Hệ số b (x):
              </label>
              <input
                type="number"
                step="any"
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Nhập hệ số b"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Hệ số c (hằng số):
              </label>
              <input
                type="number"
                step="any"
                value={c}
                onChange={(e) => setC(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Nhập hệ số c"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={solveEquation}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition duration-200 shadow-lg text-lg"
              >
                🔍 Giải Phương Trình
              </button>
              <button
                onClick={reset}
                className="flex-1 bg-gray-500 text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-600 transform hover:scale-105 transition duration-200 shadow-lg text-lg"
              >
                🔄 Làm Mới
              </button>
            </div>
          </div>

          {/* Solution Display */}
          {renderSolution()}
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">💡 Hướng dẫn:</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Nhập các hệ số a, b, c vào ô tương ứng</li>
            <li>• Hệ số a phải khác 0 để có phương trình bậc 2</li>
            <li>• Nếu a = 0, phương trình sẽ trở thành phương trình bậc nhất</li>
            <li>• Công cụ sẽ hiển thị cả nghiệm thực và nghiệm phức (nếu có)</li>
            <li>• Delta (Δ) = b² - 4ac quyết định số nghiệm của phương trình</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
